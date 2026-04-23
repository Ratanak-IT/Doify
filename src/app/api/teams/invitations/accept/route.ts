import { NextRequest, NextResponse } from "next/server";
import { apiFetch, getAuth } from "@/lib/api";

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  try {
    const data = await apiFetch(`/teams/invitations/accept?token=${encodeURIComponent(token)}`, {
      method: "GET",
      authHeader: getAuth(req),
    });
    return NextResponse.json(data ?? { message: "Invitation accepted" });
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string };
    return NextResponse.json(
      { message: err.message ?? "Failed to accept invitation" },
      { status: err.status ?? 500 }
    );
  }
}