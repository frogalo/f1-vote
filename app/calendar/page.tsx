"use client";

import { races, raceResults } from "@/lib/data";
import { generateMockVotes } from "@/lib/mockData";
import { clsx } from "clsx";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { calculateRaceScore } from "@/lib/scoring";
import { useEffect, useState } from "react";

export default function CalendarPage() {
    const { votes, userId: currentUserId, loadFromIndexedDB, addVote } = useStore();
    const [loading, setLoading] = useState(true);
    const now = new Date();
    const completedRaceCount = raceResults.length;

    useEffect(() => {
        loadFromIndexedDB().then(async () => {
            // Check if we have votes for Jakub specifically
            const currentVotes = useStore.getState().votes;
            const hasJakubVotes = currentVotes.some(v => v.userId === "user-jakub");

            if (!hasJakubVotes) {
                const { getJakubVotes } = await import("@/lib/mockData");
                const jakubVotes = getJakubVotes();
                for (const vote of jakubVotes) {
                    await addVote({
                        driverId: vote.driverId,
                        raceRound: vote.raceRound,
                    });
                }
            }
            setLoading(false);
        });
    }, [loadFromIndexedDB, addVote]);

    const getRaceStatus = (raceRound: number) => {
        if (raceRound <= completedRaceCount) return "completed";
        if (raceRound === completedRaceCount + 1) return "upcoming";
        return "future";
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
        });
    };

    const getCountdown = (dateString: string) => {
        const date = new Date(dateString);
        const diffTime = date.getTime() - now.getTime();
        if (diffTime < 0) return null;
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days === 0) return `${hours}h`;
        if (days < 7) return `${days} dni ${hours}h`;
        return `${days} dni`;
    };

    if (loading) return null;

    return (
        <div className="pb-24 max-w-4xl mx-auto">
            <h1 className="text-3xl font-black mb-2 text-center bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent uppercase tracking-tight">
                Kalendarz F1 2026
            </h1>
            <p className="text-slate-400 text-center mb-8 text-sm">24 wyścigi na całym świecie</p>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {races.map((race) => {
                    const status = getRaceStatus(race.round);
                    const countdown = status !== "completed" ? getCountdown(race.date) : null;

                    // Calculate points for current user if completed
                    let points = 0;
                    if (status === "completed") {
                        const score = calculateRaceScore(currentUserId, race.round, votes);
                        points = score.totalPoints;
                    }

                    const CardElement = (status === "completed" || status === "upcoming") ? Link : "div";
                    const cardProps = status === "completed"
                        ? { href: `/race/${race.round}/results` }
                        : status === "upcoming"
                            ? { href: `/race/${race.round}` }
                            : {};

                    return (
                        <CardElement
                            key={race.round}
                            {...cardProps}
                            className={clsx(
                                "block p-4 rounded-xl border-l-4 transition-all relative overflow-hidden",
                                status === "completed" && "bg-slate-900/50 border-slate-700 opacity-80 hover:opacity-100 hover:border-cyan-500 cursor-pointer",
                                status === "upcoming" && "bg-orange-600/10 border-orange-500 border-l-orange-500 shadow-lg shadow-orange-500/10 hover:bg-orange-600/20 cursor-pointer",
                                status === "future" && "bg-slate-800/10 border-slate-700 opacity-60"
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={clsx(
                                        "w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm",
                                        status === "completed" && "bg-slate-800 text-slate-400 border border-slate-700",
                                        status === "upcoming" && "bg-orange-500 text-white shadow-lg shadow-orange-500/30",
                                        status === "future" && "bg-slate-800 text-slate-500 border border-slate-700"
                                    )}>
                                        {race.round}
                                    </div>
                                    <div>
                                        <div className="font-bold text-base leading-tight text-slate-100 uppercase tracking-tight">{race.name}</div>
                                        <div className="text-xs text-slate-400 font-medium">{race.location}</div>
                                    </div>
                                </div>

                                {status === "completed" && (
                                    <div className="text-right">
                                        <div className="text-xl font-black text-cyan-400">+{points}</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Twoje pkt</div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 font-mono">📅 {formatDate(race.date)}</span>
                                    {status === "upcoming" && (
                                        <span className="animate-pulse flex h-2 w-2 rounded-full bg-orange-500"></span>
                                    )}
                                </div>

                                {countdown && (
                                    <div className={clsx(
                                        "px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter",
                                        status === "upcoming" && "bg-orange-600 text-white",
                                        status === "future" && "bg-slate-800 text-slate-400 border border-slate-700"
                                    )}>
                                        {countdown}
                                    </div>
                                )}

                                {status === "completed" && (
                                    <div className="text-[10px] text-cyan-500 font-black uppercase tracking-widest bg-cyan-500/10 px-2 py-1 rounded-md">
                                        Wyniki →
                                    </div>
                                )}
                                {status === "upcoming" && (
                                    <div className="text-[10px] text-orange-500 font-black uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded-md">
                                        Głosuj teraz →
                                    </div>
                                )}
                                {status === "future" && (
                                    <div className="w-10" />
                                )}
                            </div>
                        </CardElement>
                    );
                })}
            </div>
        </div>
    );
}
