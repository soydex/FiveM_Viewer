import { NextRequest, NextResponse } from "next/server";

const DISCORD_AUTH_URL = "https://discord.com/api/oauth2/authorize";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  if (provider !== "discord") {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Discord Client ID not configured" },
      { status: 500 },
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/sync/callback/discord`;
  const url = `${DISCORD_AUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;

  return NextResponse.redirect(url);
}
