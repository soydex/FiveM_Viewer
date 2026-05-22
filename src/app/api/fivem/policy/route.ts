import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Identifier (id) is required" },
      { status: 400 },
    );
  }

  const url = `https://policy-live.fivem.net/api/getUserInfo/${encodeURIComponent(id)}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "FiveM-Viewer/1.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      // If policy-live returns 404, it might just mean no policy entries for this ID
      if (response.status === 404) {
        return NextResponse.json({ status: "clean", id });
      }
      return NextResponse.json(
        { error: `Policy API returned ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to check policy", details: error.message },
      { status: 500 },
    );
  }
}
