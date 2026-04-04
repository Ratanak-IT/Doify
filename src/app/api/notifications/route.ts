import { apiFetch, getAuth } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";


const mapN = (n: any) => ({
  id: String(n.id),
  type: n.type ?? "info",
  message: n.message ?? "",
  referenceId: n.referenceId ?? null,
  referenceType: n.referenceType ?? null,
  isRead: n.isRead ?? false,
  createdAt: n.createdAt ?? new Date().toISOString(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "0";
    const size = searchParams.get("size") ?? "20";

    const data = await apiFetch(`/notifications?page=${page}&size=${size}`, {
      authHeader: getAuth(req),
    });

    if (Array.isArray(data)) {
      return NextResponse.json({
        content: data.map(mapN),
        pageNumber: Number(page),
        pageSize: Number(size),
        totalElements: data.length,
        totalPages: 1,
        last: true,
      });
    }

    return NextResponse.json({
      ...data,
      content: Array.isArray(data?.content) ? data.content.map(mapN) : [],
    });
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string };
    return NextResponse.json(
      { message: err.message ?? "Failed to load notifications" },
      { status: err.status ?? 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  if (action === "read-all") {
    try {
      await apiFetch("/notifications/read-all", { method: "PATCH", authHeader: getAuth(req) });
      return NextResponse.json({ message: "All notifications marked as read" });
    } catch (e: unknown) {
      const err = e as { status?: number; message?: string };
      return NextResponse.json({ message: err.message ?? "Failed" }, { status: err.status ?? 500 });
    }
  }
  return NextResponse.json({ message: "Unknown action" }, { status: 400 });
}