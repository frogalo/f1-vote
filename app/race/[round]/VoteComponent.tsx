"use client";

import { useStore } from "@/lib/store";
import { Driver } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { clsx } from "clsx";

type Props = {
  race: { round: number; name: string; date: string };
  drivers: Driver[];
};

export function VoteComponent({ race, drivers }: Props) {
  const { addVote } = useStore();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const fp1Time = new Date(race.date).getTime() - 48 * 60 * 60 * 1000;
    const interval = setInterval(() => {
      const diff = fp1Time - Date.now();
      if (diff <= 0) {
        setTimeLeft("Likely Started");
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [race]);

  const handleVote = async (driverId: string) => {
    if (voted) return;
    setVoted(true);
    await addVote({ driverId, raceRound: race.round });
    alert("Vote Saved Offline 🏁"); 
    router.push("/leaderboard?tab=race");
  };

  return (
    <div className="pb-24 pt-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 uppercase">
          {race.name}
        </h2>
        <div className="inline-block px-3 py-1 bg-slate-800 rounded-full mt-2 border border-slate-700">
          <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest">
            FP1: {timeLeft || "LOADING..."}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {drivers.map((driver) => (
          <button
            key={driver.id}
            onClick={() => handleVote(driver.id)}
            disabled={voted}
            className={clsx(
              "flex items-center p-3 rounded-xl border-l-[6px] bg-slate-900 shadow-md transform transition-all active:scale-95 disabled:opacity-50",
              driver.color.replace("bg-", "border-")
            )}
            style={{minHeight: "64px"}}
          >
            <div className="w-12 text-center text-xl font-black text-slate-600 italic">
              #{driver.number}
            </div>
            <div className="flex-1 text-left px-2">
              <div className="font-bold text-lg text-slate-100 leading-tight">
                {driver.name}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {driver.team}
              </div>
            </div>
            <div className={clsx("w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]", driver.color.split(" ")[0].replace("bg-", "text-"))} />
          </button>
        ))}
      </div>
    </div>
  );
}
