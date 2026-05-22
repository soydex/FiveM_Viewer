import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/sync/callback/${provider}`;

  let providerId = "";

  try {
    if (provider === "github") {
      // Exchange code for token
      const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (tokenData.error) throw new Error(tokenData.error_description);

      // Fetch user profile
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${tokenData.access_token}`,
        },
      });
      const userData = await userResponse.json();
      providerId = userData.id.toString();

    } else if (provider === "discord") {
      // Exchange code for token
      const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID || "",
          client_secret: process.env.DISCORD_CLIENT_SECRET || "",
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (tokenData.error) throw new Error(tokenData.error_description);

      // Fetch user profile
      const userResponse = await fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });
      const userData = await userResponse.json();
      providerId = userData.id;
    } else {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    // Save/Get user from DB
    let user = db.prepare("SELECT id FROM users WHERE provider = ? AND provider_id = ?").get(provider, providerId) as { id: number } | undefined;

    if (!user) {
      const result = db.prepare("INSERT INTO users (provider, provider_id) VALUES (?, ?)").run(provider, providerId);
      user = { id: result.lastInsertRowid as number };
    }

    // Generate Sync Token
    const syncToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });

    // Redirect to settings with token in hash to be picked up by client
    // We use hash so the token is not sent to server logs
    return NextResponse.redirect(`${baseUrl}/settings#sync_token=${syncToken}`);

  } catch (error: any) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
