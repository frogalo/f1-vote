import { Suspense } from "react";
import LeaderboardContent from "./LeaderboardContent";

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div className="text-center p-8 text-slate-500 animate-pulse">Ładowanie wyników...</div>}>
      <LeaderboardContent />
    </Suspense>
  );
}
