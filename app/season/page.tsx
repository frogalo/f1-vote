"use client";

import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

export default function SeasonVotePage() {
  const { drivers, addVote, loadFromIndexedDB } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromIndexedDB().then(() => setLoading(false));
  }, [loadFromIndexedDB]);

  const handleVote = async (driverId: string) => {
    // Optimistic UI handled in store
    await addVote({ driverId, raceRound: "season" });
    
    // Toast simulation (or implement real toast)
    alert("Saved offline! Redirecting..."); // Simple for PWA
    
    router.push("/leaderboard?tab=season");
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-800 rounded-lg w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="pb-24">
      <h1 className="text-2xl font-bold mb-4 text-center">Vote 2025 Champion</h1>
      <p className="text-slate-400 text-center mb-6">Who will win the season?</p>
      
      <div className="grid grid-cols-1 gap-3">
        {drivers.map((driver) => (
          <button
            key={driver.id}
            onClick={() => handleVote(driver.id)}
            className={clsx(
              "flex items-center p-3 rounded-lg border-l-4 bg-slate-800 transition active:scale-95 touch-manipulation",
              driver.color.replace("bg-", "border-") // Use team color as border
            )}
            style={{ minHeight: "64px" }} // min tap target 48px+
          >
            <span className="text-xl font-bold w-12 text-slate-500">#{driver.number}</span>
            <div className="text-left flex-1">
              <div className="font-bold text-lg">{driver.name}</div>
              <div className="text-xs text-slate-400 uppercase">{driver.team}</div>
            </div>
            {/* Team Stripe visual */}
            <div className={clsx("w-2 h-8 rounded-full ml-auto", driver.color.split(" ")[0])} />
          </button>
        ))}
      </div>
    </div>
  );
}
