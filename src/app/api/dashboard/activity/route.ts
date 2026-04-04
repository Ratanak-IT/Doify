import { apiFetch, getAuth } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";


const COLORS = ["#ad46ff","#00c950","#ff6900","#00b8db","#fb2c36","#2b7fff","#615fff","#f6339a"];
const ini = (n: string) => n.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

export async function GET(req: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d: any = await apiFetch("/dashboard", { authHeader: getAuth(req) });
    const raw: any[] = d.recentActivity ?? d.recent_activity ?? d.activities ?? d.activityLog ?? [];
    return NextResponse.json(raw.map((item: any, idx: number) => {
      const name = item.user?.fullName ?? item.user?.name ?? item.performedBy?.fullName ?? "User";
      return { id: String(item.id), user: { name, initials: ini(name), color: COLORS[idx % COLORS.length] }, action: item.action ?? item.type ?? "updated", target: item.target ?? item.taskTitle ?? item.description ?? "", createdAt: item.createdAt ?? new Date().toISOString() };
    }));
  } catch {
    return NextResponse.json([]);
  }
}
