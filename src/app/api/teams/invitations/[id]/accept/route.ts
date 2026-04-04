import { NextRequest, NextResponse } from "next/server";
import { apiFetch, getAuth } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

// POST /api/teams/invitations/[id]/accept
// Proxies to: POST /api/v1/teams/invitations/{id}/accept
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const data = await apiFetch(`/teams/invitations/${id}/accept`, {
      method: "POST",
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