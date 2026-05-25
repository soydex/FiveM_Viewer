import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const locale = searchParams.get("locale");

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  // We'll use a combination of known endpoints to find servers
  // Since there is no single "search" endpoint that is easy to use,
  // we fetch from top servers and pinned servers as a primary source.

  try {
    const results: any[] = [];
    const seenIds = new Set<string>();

    // 1. Fetch pinned servers
    const pinsRes = await fetch("https://runtime.fivem.net/pins.json");
    const pinnedIds = pinsRes.ok
      ? (await pinsRes.json()).pinnedServers || []
      : [];

    // 2. Fetch top servers for common locales to have a larger pool
    const locales = ["en-US", "fr-FR", "de-DE", "es-ES"];
    const topPromises = locales.map((l) =>
      fetch(`https://frontend.cfx-services.net/api/servers/top/${l}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    );

    const topDataResults = await Promise.all(topPromises);
    const candidateServers: any[] = [];

    // Add pinned server IDs to candidates
    pinnedIds.slice(0, 30).forEach((id: string) => {
      candidateServers.push({ id, isPinned: true });
    });

    // Add top servers to candidates
    topDataResults.forEach((data) => {
      if (data && Array.isArray(data)) {
        data.slice(0, 50).forEach((s: any) => {
          if (!seenIds.has(s.id)) {
            candidateServers.push(s);
            seenIds.add(s.id);
          }
        });
      }
    });

    // Filtering logic (simulating a search)
    // In a real app, we'd have a database or a more powerful search API
    // Here we filter the candidates we found
    const matches = candidateServers.filter((s) => {
      const name = s.hostname || s.name || "";
      return name.toLowerCase().includes(query.toLowerCase());
    });

    // For the ones that are just IDs (from pins), we need to fetch their info
    const detailedTasks = matches.slice(0, 15).map(async (s) => {
      if (s.hostname) return s; // Already has info

      try {
        const res = await fetch(
          `https://frontend.cfx-services.net/api/servers/single/${s.id}`,
          {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          return { ...data.Data, id: s.id };
        }
      } catch (e) {}
      return null;
    });

    const detailedResults = await Promise.all(detailedTasks);

    const finalResults = detailedResults
      .filter((s) => s !== null)
      .map((s) => ({
        id: s.id || s.endpoint,
        name: (s.hostname || s.name || "Unknown Server").replace(/\^\d/g, ""),
        players: s.clients || 0,
        maxPlayers: s.sv_maxclients || 0,
        tags: s.vars?.tags?.split(",").slice(0, 3) || [],
        locale: s.vars?.locale || "en-US",
      }));

    return NextResponse.json(finalResults);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
