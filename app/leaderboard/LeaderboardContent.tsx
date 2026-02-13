"use client";

import { useStore } from "@/lib/store";
import { drivers } from "@/lib/data";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";

export default function LeaderboardContent() {
  const { votes, loadFromIndexedDB } = useStore();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const defaultTab = tabParam === "race" ? "race" : "season";
  const [activeTab, setActiveTab] = useState<"season" | "race">(defaultTab);

  useEffect(() => {
    loadFromIndexedDB();
  }, [loadFromIndexedDB]);

  // Aggregate votes
  const results = useMemo(() => {
    const counts: Record<string, number> = {};
    const scope = activeTab === "season" ? "season" : 1;
    
    votes.filter(v => v.raceRound === scope).forEach(v => {
      counts[v.driverId] = (counts[v.driverId] || 0) + 1;
    });

    const max = Math.max(...Object.values(counts), 1);

    return drivers
      .map(d => ({
        ...d,
        count: counts[d.id] || 0,
        percent: ((counts[d.id] || 0) / max) * 100
      }))
      .sort((a, b) => b.count - a.count);
  }, [votes, activeTab]);

  const handleShare = async () => {
    const top = results[0];
    const text = `I voted for ${top ? top.name : "Runners"} to win the ${activeTab === 'season' ? '2025 season' : 'Australian GP'} 🏎️`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Copied share text!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalVotes = results.reduce((a, b) => a + b.count, 0);

  return (
    <div className="pb-24 pt-4 px-2">
      {/* Toggles */}
      <div className="flex bg-slate-900 rounded-full p-1 mb-8 relative border border-slate-800 shadow-inner">
        <div 
          className={clsx(
            "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-blue-600 rounded-full transition-all duration-300 ease-in-out shadow-lg",
            activeTab === 'race' ? "left-1/2 translate-x-[2px]" : "left-1"
          )}
        />
        <button
          className={clsx("flex-1 text-center py-2 z-10 text-xs font-bold transition-colors uppercase tracking-wider relative", activeTab === 'season' ? "text-white" : "text-slate-400")}
          onClick={() => setActiveTab('season')}
        >
          Season
        </button>
        <button
          className={clsx("flex-1 text-center py-2 z-10 text-xs font-bold transition-colors uppercase tracking-wider relative", activeTab === 'race' ? "text-white" : "text-slate-400")}
          onClick={() => setActiveTab('race')}
        >
          Next Race
        </button>
      </div>

      {/* Stats Header */}
      <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-2">
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Leaderboard</h2>
          <p className="text-xs text-slate-500 font-mono uppercase mt-1">{totalVotes} VOTES CAST</p>
        </div>
        <button 
          onClick={handleShare}
          className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-400 p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-slate-700"
        >
          SHARE 📤
        </button>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {results.map((r, i) => (
          <div key={r.id} className="relative group/bar">
            {/* Driver Info */}
            <div className="flex justify-between items-end mb-1 px-1 relative z-10 pointer-events-none">
              <span className="font-bold text-sm text-slate-200 flex items-center">
                <span className="text-slate-500 font-mono w-6 text-xs mr-2">#{r.number}</span>
                {i + 1}. {r.name}
              </span>
              <span className="font-mono font-bold text-cyan-400 text-sm">{r.count}</span>
            </div>

            {/* Bar Background */}
            <div className="h-6 bg-slate-900/50 rounded-r-md overflow-hidden relative w-full flex items-center border-l-2 border-slate-800">
              {/* Animated Bar */}
              <div 
                className={clsx("h-full transition-all duration-700 ease-out flex items-center justify-end pr-2", r.color.split(" ")[0])}
                style={{ width: `${Math.max(r.percent, 2)}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {totalVotes === 0 && (
        <div className="text-center py-12 text-slate-500 animate-pulse">
          No votes yet. Be the first!
        </div>
      )}
    </div>
  );
}
