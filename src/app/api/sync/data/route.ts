import { NextResponse } from "next/server";

// Service arrêté : cette route API est désactivée, plus aucun appel n'est effectué.
export function GET() {
  return NextResponse.json(
    { error: "Service permanently shut down" },
    { status: 410 },
  );
}

export function POST() {
  return NextResponse.json(
    { error: "Service permanently shut down" },
    { status: 410 },
  );
}
