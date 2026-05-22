import { NextRequest, NextResponse } from "next/server";

const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";
const DISCORD_AUTH_URL = "https://discord.com/api/oauth2/authorize";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/sync/callback/${provider}`;

  let url = "";

  if (provider === "github") {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) return NextResponse.json({ error: "GitHub Client ID not configured" }, { status: 500 });
    url = `${GITHUB_AUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`;
  } else if (provider === "discord") {
    const clientId = process.env.DISCORD_CLIENT_ID;
    if (!clientId) return NextResponse.json({ error: "Discord Client ID not configured" }, { status: 500 });
    url = `${DISCORD_AUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;
  } else {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  return NextResponse.redirect(url);
}
