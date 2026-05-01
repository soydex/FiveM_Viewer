import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint") || "46.105.78.95:30120";
  const identifiers = searchParams.getAll("identifiers[]");

  const results: any = {};

  try {
    const infoRes = await fetch(`http://${endpoint}/info.json`).catch(() => null);
    results.info = infoRes?.ok ? await infoRes.json() : null;

    if (identifiers.length > 0) {
      const queryParams = identifiers.map(id => `identifiers[]=${encodeURIComponent(id)}`).join("&");
      const url = `https://lambda.fivem.net/api/ticket/playtimes/${endpoint}?${queryParams}`;
      
      const playtimeRes = await fetch(url).catch(() => null);
      results.playtime = playtimeRes?.ok ? await playtimeRes.json() : null;
    }

    const countsRes = await fetch("https://runtime.fivem.net/counts.json").catch(() => null);
    results.globalCounts = countsRes?.ok ? await countsRes.json() : null;

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch player stats" }, { status: 500 });
  }
}
