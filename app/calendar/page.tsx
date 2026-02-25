"use client";

import { raceResults } from "@/lib/data";
import { clsx } from "clsx";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { calculateRaceScore } from "@/lib/scoring";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { getRaces } from "@/app/actions/races";

const trackSlugs: Record<number, string> = {
    1: "melbourne",
    2: "shanghai",
    3: "suzuka",
    4: "sakhir",
    5: "jeddah",
    6: "miami",
    7: "montreal",
    8: "monaco",
    9: "barcelona",
    10: "spielberg",
    11: "silverstone",
    12: "spa",
    13: "budapest",
    14: "zandvoort",
    15: "monza",
    16: "madrid",
    17: "baku",
    18: "singapore",
    19: "austin",
    20: "mexico",
    21: "saopaulo",
    22: "lasvegas",
    23: "lusail",
    24: "yasmarina"
};

type Race = {
    round: number;
    name: string;
    location: string;
    date: Date;
    trackImage: string | null;
};

export default function CalendarPage() {
    const { votes, userId: currentUserId, loadFromIndexedDB, addVote } = useStore();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [races, setRaces] = useState<Race[]>([]);
    const now = new Date();
    const completedRaceCount = raceResults.length;

    useEffect(() => {
        if (!authLoading && user?.isAdmin) {
            router.push("/admin");
            return;
        }
        
        const load = async () => {
             await loadFromIndexedDB();
             const fetchedRaces = await getRaces();
             setRaces(fetchedRaces);
             setLoading(false);
        };
        load();

    }, [loadFromIndexedDB, user, authLoading, router]);

    const getRaceStatus = (raceRound: number) => {
        if (raceRound <= completedRaceCount) return "completed";
        if (raceRound === completedRaceCount + 1) return "upcoming";
        return "future";
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "short",
        });
    };

    const getCountdown = (date: Date) => {
        const diffTime = new Date(date).getTime() - now.getTime();
        if (diffTime < 0) return null;
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days === 0) return `${hours}h`;
        if (days < 7) return `${days}d ${hours}h`;
        return `${days}d`;
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#E60000]"></div>
        </div>
    );

    return (
        <div className="pb-32 max-w-4xl mx-auto pt-8">
            <h1 className="text-4xl font-black mb-1 px-4 text-white uppercase tracking-tighter">
                Terminarz F1 <span className="text-[#E60000]">2026</span>
            </h1>
            <p className="text-gray-500 px-4 mb-8 text-sm font-bold tracking-widest">24 WYŚCIGI • MISTRZOSTWA ŚWIATA</p>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                {races.map((race) => {
                    const status = getRaceStatus(race.round);
                    const countdown = status !== "completed" ? getCountdown(race.date) : null;
                    const slug = trackSlugs[race.round] || "melbourne";

                    // Calculate points for current user if completed
                    let points = 0;
                    if (status === "completed") {
                        const score = calculateRaceScore(currentUserId || "", race.round, votes);
                        points = score.totalPoints;
                    }

                    const CardElement = ((status === "completed" || status === "upcoming") ? Link : "div") as any;
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
                                "block p-6 rounded-[2rem] transition-all relative overflow-hidden group",
                                // Dark Grey Card Background
                                "bg-[#1C1C1E] border border-white/5",
                                status === "completed" && "opacity-80 hover:opacity-100",
                                status === "upcoming" && "bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border-[#E60000]/30 shadow-2xl shadow-red-900/10 scale-[1.02] z-10",
                                status === "future" && "opacity-40"
                            )}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex flex-col">
                                    <span className={clsx(
                                        "text-[10px] font-black uppercase tracking-[0.2em] mb-1",
                                        status === "upcoming" ? "text-[#E60000]" : "text-gray-600"
                                    )}>
                                        R{String(race.round).padStart(2, '0')}
                                    </span>
                                    <div className="font-black text-2xl leading-none text-white uppercase tracking-tighter mb-1">
                                        {race.name.replace(" Grand Prix", "")}
                                    </div>
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">{race.location}</div>
                                </div>

                                {status === "upcoming" && (
                                    <div className="bg-[#E60000] text-white text-[10px] font-black px-2 py-1 rounded-lg animate-pulse">
                                        NA ŻYWO
                                    </div>
                                )}
                            </div>

                            <div className="relative h-24 mt-2 mb-4 flex items-center justify-center">
                                {/* Track Image */}
                                <img
                                    src={race.trackImage || `https://media.formula1.com/image/upload/c_lfill,w_1000/v1740000000/common/f1/2026/track/2026track${slug}blackoutline.svg`}
                                    alt={race.name}
                                    className={clsx(
                                        "h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110",
                                        status === "upcoming" ? "opacity-30 invert" : "opacity-10 invert"
                                    )}
                                />

                                {status === "completed" && points > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-[#E60000] text-white font-black px-3 py-1 rounded-full text-sm shadow-lg">
                                            +{points} PKT
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="text-xs text-gray-400 font-bold uppercase">
                                        {formatDate(race.date)}
                                    </div>
                                </div>

                                {status === "completed" ? (
                                    <div className="text-xs font-black text-gray-500 uppercase flex items-center gap-1 group-hover:text-white transition-colors">
                                        WYNIKI <span>→</span>
                                    </div>
                                ) : countdown ? (
                                    <div className={clsx(
                                        "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest",
                                        status === "upcoming" ? "bg-[#E60000] text-white" : "bg-[#2C2C2E] text-gray-500"
                                    )}>
                                        {countdown}
                                    </div>
                                ) : null}
                            </div>

                            {/* Accent Glow */}
                            {status === "upcoming" && (
                                <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#E60000] opacity-5 blur-[40px] rounded-full pointer-events-none" />
                            )}
                        </CardElement>
                    );
                })}
            </div>
        </div>
    );
}
