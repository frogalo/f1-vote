"use client";

import { clsx } from "clsx";
import Link from "next/link";
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
    completed: boolean;
};

type UserScore = {
    raceRound: number;
    totalPoints: number;
};

export default function CalendarPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [races, setRaces] = useState<Race[]>([]);
    const [myScores, setMyScores] = useState<UserScore[]>([]);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!authLoading && user?.isAdmin) {
            router.push("/admin");
            return;
        }
        
        const load = async () => {
            const fetchedRaces = await getRaces();
            setRaces(fetchedRaces as Race[]);

            // Load user scores if logged in
            if (user?.id) {
                try {
                    const { getLeaderboardScoresForUser } = await import("@/app/actions/raceResults");
                    const scores = await getLeaderboardScoresForUser(user.id);
                    setMyScores(scores);
                } catch {
                    // Scores not available yet
                }
            }

            setLoading(false);
        };
        load();

    }, [user, authLoading, router]);

    const getRaceStatus = (race: Race) => {
        if (race.completed) return "completed";
        // If date has passed but not completed, this race is live
        if (new Date(race.date) < now && !race.completed) return "active";
        // Find the first un-completed race whose date is still in the future (next up)
        const nextRace = races.find(r => !r.completed && new Date(r.date) > now);
        if (nextRace && race.round === nextRace.round) return "upcoming";
        return "future";
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "short",
        });
    };

    const getCountdownInfo = (date: Date) => {
        const diffTime = new Date(date).getTime() - now.getTime();
        if (diffTime < 0) return null;
        
        const totalSeconds = Math.floor(diffTime / 1000);
        const seconds = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const minutes = totalMinutes % 60;
        const totalHours = Math.floor(totalMinutes / 60);
        const hours = totalHours % 24;
        const days = Math.floor(totalHours / 24);
        
        if (totalSeconds < 60) return { text: `${totalSeconds}s`, type: 'urgent' };
        if (days === 0 && hours === 0) return { text: `${minutes}m ${seconds}s`, type: 'seconds' };
        if (days === 0) return { text: `${hours}h ${minutes}m`, type: 'hours' };
        if (days < 7) return { text: `${days}d ${hours}h`, type: 'days' };
        return { text: `${days}d`, type: 'days' };
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
                    const status = getRaceStatus(race);
                    const countdownInfo = status !== "completed" ? getCountdownInfo(race.date) : null;
                    const slug = trackSlugs[race.round] || "melbourne";

                    // Get user's score for this race from the database
                    const raceScore = myScores.find(s => s.raceRound === race.round);
                    const points = raceScore?.totalPoints || 0;

                    const href = status === "completed"
                        ? `/race/${race.round}/results`
                        : status === "active" || status === "upcoming"
                            ? `/race/${race.round}`
                            : null;

                    const cardClasses = clsx(
                        "block p-6 rounded-[2rem] transition-all relative overflow-hidden group",
                        "bg-[#1C1C1E] border border-white/5",
                        status === "completed" && "opacity-80 hover:opacity-100",
                        status === "active" && "bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border-[#E60000]/30 shadow-2xl shadow-red-900/10 scale-[1.02] z-10",
                        status === "upcoming" && "bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border-white/20 shadow-lg scale-[1.01]",
                        status === "future" && "opacity-40"
                    );

                    const cardContent = (
                        <>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex flex-col">
                                    <span className={clsx(
                                        "text-[10px] font-black uppercase tracking-[0.2em] mb-1",
                                        status === "active" ? "text-[#E60000]" : "text-gray-600"
                                    )}>
                                        R{String(race.round).padStart(2, '0')}
                                    </span>
                                    <div className="font-black text-2xl leading-none text-white uppercase tracking-tighter mb-1">
                                        {race.name.replace(" Grand Prix", "")}
                                    </div>
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">{race.location}</div>
                                </div>

                                {status === "active" && (
                                    <div className="bg-[#E60000] text-white text-[10px] font-black px-2 py-1 rounded-lg animate-pulse">
                                        NA ŻYWO
                                    </div>
                                )}
                                {status === "upcoming" && (
                                    <div className="bg-[#2C2C2E] text-gray-400 text-[10px] font-black px-2 py-1 rounded-lg">
                                        NASTĘPNY
                                    </div>
                                )}
                            </div>

                            <div className="relative h-24 mt-2 mb-4 flex items-center justify-center">
                                {/* Track Image */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={race.trackImage || `https://media.formula1.com/image/upload/c_lfill,w_1000/v1740000000/common/f1/2026/track/2026track${slug}blackoutline.svg`}
                                    alt={race.name}
                                    className={clsx(
                                        "h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110",
                                        status === "active" ? "opacity-30 invert" : "opacity-10 invert"
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
                                ) : countdownInfo ? (
                                    <div className={clsx(
                                        "px-3 py-1 rounded-xl font-black uppercase tracking-widest flex items-center justify-center transition-all duration-300",
                                        (status === "active" || countdownInfo.type === 'urgent') ? "bg-gradient-to-r from-[#E60000] to-[#ff4d4d] text-white" : "bg-[#2C2C2E] text-gray-400",
                                        countdownInfo.type === 'urgent' ? "text-xl scale-125 animate-bounce shadow-[0_0_30px_rgba(230,0,0,0.4)] z-50 border border-white/20" :
                                        countdownInfo.type === 'seconds' ? "text-sm text-white border border-white/10" :
                                        countdownInfo.type === 'hours' ? "text-sm" : "text-[10px]"
                                    )}>
                                        {countdownInfo.text}
                                    </div>
                                ) : null}
                            </div>

                            {/* Accent Glow */}
                            {status === "active" && (
                                <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#E60000] opacity-5 blur-[40px] rounded-full pointer-events-none" />
                            )}
                        </>
                    );

                    return href ? (
                        <Link key={race.round} href={href} className={cardClasses}>
                            {cardContent}
                        </Link>
                    ) : (
                        <div key={race.round} className={cardClasses}>
                            {cardContent}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
