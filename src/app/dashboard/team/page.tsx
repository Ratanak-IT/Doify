import { Suspense } from "react";
import TeamPageClient from "@/components/team/TeamPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-spin w-8 h-8 rounded-full border-4 border-[#6C5CE7] border-t-transparent" /></div>}>
      <TeamPageClient />
    </Suspense>
  );
}