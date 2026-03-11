"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { getRaces } from "@/app/actions/races";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

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
    canceled: boolean;
    hasSprint?: boolean;
    sprintDate?: string | Date;
    sprintCompleted?: boolean;
};

type UserScore = {
    raceRound: number;
    totalPoints: number;
    racePoints: number;
    sprintPoints: number;
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
            setRaces(fetchedRaces as unknown as Race[]);

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
        if (race.canceled) return "canceled";
        if (race.completed) return "completed";
        // If date has passed but not completed, this race is live
        if (new Date(race.date) < now && !race.completed) return "active";
        // Find the first un-completed and un-canceled race whose date is still in the future (next up)
        const nextRace = races.find(r => !r.completed && !r.canceled && new Date(r.date) > now);
        if (nextRace && race.round === nextRace.round) return "upcoming";
        return "future";
    };

    const handleShare = (e: React.MouseEvent, round: number, raceName: string) => {
        e.preventDefault();
        const url = `${window.location.origin}/race/${round}`;
        const cleanName = raceName.replace(" Grand Prix", "");
        
        if (navigator.share) {
            navigator.share({
                title: `F1 ${cleanName} - Typuj wyniki!`,
                text: 'Wejdź i zagłosuj w typerze F1 razem ze mną!',
                url: url,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Skopiowano link do schowka!");
        }
    };

    const handleGlobalShare = () => {
        const url = `${window.location.origin}/invite`;
        if (navigator.share) {
            navigator.share({
                title: `F1 Typy 2026 - Dołącz do gry!`,
                text: 'Załóż darmowe konto i typuj ze mną wyniki F1 w tym sezonie!',
                url: url,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Skopiowano link do schowka!");
        }
    };

    const formatDateTime = (date: Date) => {
        return new Date(date).toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black mb-1 text-white uppercase tracking-tighter">
                        Terminarz F1 <span className="text-[#E60000]">2026</span>
                    </h1>
                    <p className="text-gray-500 text-xs sm:text-sm font-bold tracking-widest">24 WYŚCIGI</p>
                </div>
                {/* <button
                    onClick={handleGlobalShare}
                    className="w-full sm:w-auto bg-[#E60000]/10 hover:bg-[#E60000]/20 text-[#E60000] border border-[#E60000]/20 px-5 py-3 rounded-2xl font-black uppercase tracking-wider text-xs sm:text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Share2 className="w-4 h-4" /> Zaproś do gry
                </button> */}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                {races.map((race) => {
                    const status = getRaceStatus(race);
                    const countdownInfo = (status !== "completed" && status !== "canceled") ? getCountdownInfo(race.date) : null;
                    const slug = trackSlugs[race.round] || "melbourne";

                    // Get user's score for this race from the database
                    const raceScore = myScores.find(s => s.raceRound === race.round);
                    const totalPoints = raceScore?.totalPoints || 0;
                    const racePoints = raceScore?.racePoints || 0;
                    const sprintPoints = raceScore?.sprintPoints || 0;

                    const href = (status === "completed" || status === "active" || status === "upcoming")
                        ? `/race/${race.round}`
                        : null;

                    const cardClasses = clsx(
                        "block p-6 rounded-[2rem] transition-all relative overflow-hidden group",
                        !race.hasSprint && "bg-[#1C1C1E] border border-white/5",
                        race.hasSprint && "border border-transparent",
                        status === "completed" && "opacity-80 hover:opacity-100",
                        status === "canceled" && "opacity-50 grayscale hover:grayscale-0",
                        status === "active" && !race.hasSprint && "bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border-[#E60000]/30 shadow-2xl shadow-red-900/10 scale-[1.02] z-10",
                        status === "active" && race.hasSprint && "shadow-2xl shadow-orange-900/10 scale-[1.02] z-10",
                        status === "upcoming" && !race.hasSprint && "bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border-white/20 shadow-lg scale-[1.01]",
                        status === "upcoming" && race.hasSprint && "shadow-lg scale-[1.01]",
                        status === "future" && "opacity-40"
                    );

                    const sprintBorderLeft = "rgba(255, 255, 255, 0.05)";
                    const sprintBorderRight = status === "active" || status === "upcoming" ? "rgba(255, 120, 0, 0.4)" : "rgba(255, 120, 0, 0.15)";
                    const sprintBackgroundStyle = race.hasSprint 
                        ? { 
                            background: `linear-gradient(to right, #1c1c1e 49.7%, rgba(255, 120, 0, 0.4) 49.7%, rgba(255, 120, 0, 0.4) 50.3%, #3a1a05 50.3%), linear-gradient(to right, ${sprintBorderLeft} 50%, ${sprintBorderRight} 50%)`,
                            backgroundClip: 'padding-box, border-box',
                            backgroundOrigin: 'padding-box, border-box'
                          } 
                        : undefined;

                    const cardContent = (
                        <div className="relative z-10 flex flex-col h-full">
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

                                <div className="flex items-center gap-2">
                                    {/* <button 
                                        onClick={(e) => handleShare(e, race.round, race.name)}
                                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-sm z-20"
                                        title="Udostępnij i zaproś znajomych"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button> */}

                                    {status === "active" && (
                                        <div className="bg-[#E60000] text-white text-[10px] font-black px-2 py-1 rounded-lg animate-pulse">
                                            NA ŻYWO
                                        </div>
                                    )}
                                    {status === "canceled" && (
                                        <div className="bg-red-900/30 text-red-500 border border-red-500/20 text-[10px] font-black px-2 py-1 rounded-lg">
                                            ODWOŁANY
                                        </div>
                                    )}
                                    {status === "upcoming" && (
                                        <div className="bg-[#2C2C2E] text-gray-400 text-[10px] font-black px-2 py-1 rounded-lg">
                                            NASTĘPNY
                                        </div>
                                    )}
                                </div>
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

                                {status === "completed" && totalPoints > 0 && !race.hasSprint && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="bg-[#E60000] text-white font-black px-3 py-1 rounded-full text-sm shadow-lg">
                                            +{totalPoints} PKT
                                        </div>
                                    </div>
                                )}

                                {race.hasSprint && (
                                    <>
                                        {/* Left Side (Race) Points */}
                                        {status === "completed" && racePoints > 0 && (
                                           <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                                                <div className="bg-[#E60000] text-white font-black px-2 py-1 rounded-full text-xs shadow-lg">
                                                    +{racePoints} PKT
                                                </div>
                                            </div>
                                        )}
                                        {/* Right Side (Sprint) Points */}
                                        {race.sprintCompleted && sprintPoints > 0 && (
                                           <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                                <div className="bg-orange-500 text-white font-black px-2 py-1 rounded-full text-xs shadow-lg">
                                                    +{sprintPoints} PKT
                                                </div>
                                            </div>
                                        )}
                                        {/* Total Summary */}
                                        {status === "completed" && totalPoints > 0 && (
                                            <div className="absolute inset-x-0 bottom-[35px] flex justify-center pointer-events-none">
                                                <div className="bg-[#1C1C1E] border border-white/10 text-gray-300 font-black px-2 py-0.5 rounded-lg text-[10px] shadow-lg scale-90 sm:scale-100">
                                                    SUMA: +{totalPoints}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="relative flex items-end justify-between border-t border-white/5 pt-5 mt-auto">
                                {/* Centered Status / Countdown Pill */}
                                <div className="absolute left-1/2 -translate-x-1/2 -top-0 -translate-y-1/2 z-30">
                                    {status === "completed" ? (
                                        <div className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1 group-hover:text-white transition-colors bg-[#1C1C1E] px-3 py-1 rounded-full border border-white/10 shadow-lg whitespace-nowrap">
                                            WYNIKI <span>→</span>
                                        </div>
                                    ) : status === "canceled" ? (
                                        <div className="text-[10px] font-black text-red-500/80 uppercase bg-[#1C1C1E] px-3 py-1 rounded-full border border-red-500/20 shadow-lg whitespace-nowrap">
                                            BRAK WYNIKÓW
                                        </div>
                                    ) : countdownInfo ? (
                                        <div className={clsx(
                                            "px-3 py-1 rounded-xl font-black uppercase tracking-widest flex items-center justify-center transition-all duration-300 whitespace-nowrap",
                                            (status === "active" || countdownInfo.type === 'urgent') ? "bg-gradient-to-r from-[#E60000] to-[#ff4d4d] text-white shadow-lg" : "bg-[#2C2C2E] text-gray-400 border border-white/5",
                                            countdownInfo.type === 'urgent' ? "text-xl scale-125 animate-bounce shadow-[0_0_30px_rgba(230,0,0,0.4)] z-50 border border-white/20" :
                                            countdownInfo.type === 'seconds' ? "text-sm text-white border border-white/10" :
                                            countdownInfo.type === 'hours' ? "text-sm shadow-md" : "text-[10px] shadow-sm"
                                        )}>
                                            {countdownInfo.text}
                                        </div>
                                    ) : null}
                                </div>

                                {!race.hasSprint ? (
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <div className="text-[10px] text-gray-500 font-bold uppercase leading-none">Wyścig</div>
                                        <div className="text-xs text-gray-400 font-bold uppercase flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                            {formatDateTime(race.date)}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Left side: Race Date */}
                                        <div className="flex flex-col gap-1.5 w-1/2 pr-2">
                                            <div className="text-[10px] text-gray-500 font-bold uppercase leading-none">Wyścig</div>
                                            <div className="text-[11px] sm:text-xs text-gray-400 font-bold uppercase flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-gray-500" />
                                                <span className="truncate">{formatDateTime(race.date)}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Right side: Sprint Date */}
                                        <div className="flex flex-col gap-1.5 w-1/2 pl-2 border-l border-white/10">
                                            <div className="text-[10px] text-orange-500/70 font-bold uppercase text-right leading-none">Sprint</div>
                                            <div className="text-[11px] sm:text-xs text-orange-400 font-bold uppercase flex items-center justify-end gap-1.5 drop-shadow-md">
                                                <span className="truncate">{formatDateTime(race.sprintDate ? new Date(race.sprintDate) : new Date())}</span>
                                                <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-orange-500" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Accent Glow */}
                            {status === "active" && (
                                <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#E60000] opacity-5 blur-[40px] rounded-full pointer-events-none" />
                            )}
                        </div>
                    );

                    return (
                        <div key={race.round} className={cardClasses} style={sprintBackgroundStyle}>
                            {/* Clickable Overlay Links */}
                            {href && !race.hasSprint && (
                                <Link href={href} className="absolute inset-0 z-20" />
                            )}
                            {href && race.hasSprint && (
                                <>
                                    {/* Left: Main Race Link */}
                                    <Link 
                                        href={`${href}?tab=race`} 
                                        className="absolute inset-y-0 left-0 w-1/2 z-20" 
                                        title="Typuj Wyścig"
                                    />
                                    {/* Right: Sprint Link */}
                                    <Link 
                                        href={`${href}?tab=sprint`} 
                                        className="absolute inset-y-0 right-0 w-1/2 z-20" 
                                        title="Typuj Sprint"
                                    />
                                </>
                            )}
                            
                            {cardContent}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
