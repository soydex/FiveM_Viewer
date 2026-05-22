import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint"); // e.g., 46.105.78.95:30120
  const type = searchParams.get("type") || "info"; // info, players, dynamic

  if (!endpoint) {
    return NextResponse.json(
      { error: "Endpoint is required" },
      { status: 400 },
    );
  }

  const validTypes = ["info", "players", "dynamic"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const url = `http://${endpoint}/${type}.json`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "FiveM-Viewer/1.0",
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Server returned ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Connection timed out" },
        { status: 504 },
      );
    }
    return NextResponse.json(
      { error: "Failed to connect to server", details: error.message },
      { status: 502 },
    );
  }
}
