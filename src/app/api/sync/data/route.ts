import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

function getUserIdFromRequest(request: NextRequest): number | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch (e) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userData = db
    .prepare("SELECT data_json FROM user_data WHERE user_id = ?")
    .get(userId) as { data_json: string } | undefined;

  return NextResponse.json(userData ? JSON.parse(userData.data_json) : {});
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const dataJson = JSON.stringify(data);

  db.prepare(`
    INSERT INTO user_data (user_id, data_json, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      data_json = excluded.data_json,
      updated_at = CURRENT_TIMESTAMP
  `).run(userId, dataJson);

  return NextResponse.json({ success: true });
}
