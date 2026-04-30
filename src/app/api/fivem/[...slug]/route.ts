import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  console.log(`[API Proxy] Slug: ${slug.join("/")}`);

  const path = slug.join("/");
  const url = `https://servers-frontend.fivem.net/api/${path}`;

  console.log(`[API Proxy] Fetching: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Referer: "https://servers.fivem.net/",
        Origin: "https://servers.fivem.net",
      },
    });

    console.log(`[API Proxy] Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API Proxy] Error from FiveM: ${errorText}`);
      return NextResponse.json(
        { error: `FiveM API returned ${response.status}`, details: errorText },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Proxy error" }, { status: 500 });
  }
}
