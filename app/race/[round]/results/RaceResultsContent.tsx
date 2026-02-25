"use client";

import { useStore } from "@/lib/store";
import { drivers, races, getTeamLogo, raceResults } from "@/lib/data";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

type Props = {
    raceRound: number;
};

export default function RaceResultsContent({ raceRound }: Props) {
    const { votes, userId: currentUserId, loadFromIndexedDB } = useStore();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user?.isAdmin) {
            router.push("/admin");
            return;
        }
        loadFromIndexedDB().then(() => setLoading(false));
    }, [loadFromIndexedDB, user, authLoading, router]);

    const result = raceResults.find((r) => r.round === raceRound);
    const race = races.find((r) => r.round === raceRound);

    if (!result || !race) {
        return (
            <div className="text-center p-8 flex flex-col items-center justify-center h-[50vh]">
                <p className="text-gray-500 font-medium mb-4">Wyścig w toku lub wyniki są niedostępne.</p>
                <button
                    onClick={() => router.push("/calendar")}
                    className="px-6 py-3 bg-[#E60000] text-white font-bold rounded-xl shadow-lg shadow-red-900/20 active:scale-95 transition-all"
                >
                    Wróć do terminarza
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0D0D0D] text-[#E60000]">
                <div className="animate-pulse text-xl font-bold">ŁADOWANIE WYNIKÓW...</div>
            </div>
        );
    }

    // Get user's votes for this race
    const userVotes = votes.filter(v =>
        typeof v.raceRound === "string" &&
        v.raceRound.startsWith(`race-${raceRound}-position-`)
    );

    return (
        <div className="pb-24 pt-8 px-4">
            {/* Race Header */}
            <div className="mb-8 text-center">
                <div className="text-xs font-bold text-[#E60000] uppercase tracking-widest mb-2 border border-[#E60000]/20 bg-[#E60000]/5 inline-block px-3 py-1 rounded-full">
                    Runda {race.round}
                </div>
                <h1 className="text-3xl font-black mb-1 text-white uppercase leading-none tracking-tight">
                    {race.name}
                </h1>
                <p className="text-gray-500 text-sm font-medium">{race.location}</p>
            </div>

            {/* Full Classification */}
            <div className="space-y-3">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">🏁 Wyniki i Twoje Typy</h2>
                {result.fullResults.map((driverId, position) => {
                    const driver = drivers.find((d) => d.id === driverId);
                    if (!driver) return null;

                    // Find what position the user predicted for this driver
                    const userPrediction = userVotes.find(v => v.driverId === driverId);
                    let predictedPos: number | null = null;
                    if (userPrediction && typeof userPrediction.raceRound === "string") {
                        predictedPos = parseInt(userPrediction.raceRound.split("-")[3]);
                    }

                    const isPerfect = predictedPos === position + 1;
                    const isClose = predictedPos !== null && Math.abs(predictedPos - (position + 1)) <= 2;

                    return (
                        <div
                            key={driverId}
                            className={clsx(
                                "p-4 rounded-xl border transition-all relative overflow-hidden",
                                "bg-[#1C1C1E]",
                                position === 0 ? "border-[#E60000] bg-gradient-to-br from-[#E60000]/10 to-[#1C1C1E]" : "border-white/5"
                            )}
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={clsx(
                                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                                            position === 0 ? "bg-[#E60000] text-white" : "bg-[#2C2C2E] text-gray-500"
                                        )}
                                    >
                                        {position + 1}
                                    </div>
                                    <div>
                                        <div className="font-bold text-base text-white flex items-center gap-2">
                                            {driver.name}
                                            {position === 0 && <span className="text-[10px] bg-[#E60000] text-white px-1.5 rounded uppercase">Wygrana</span>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={getTeamLogo(driver.team)}
                                                alt={driver.team}
                                                className="w-3 h-3 object-contain"
                                            />
                                            <div className="text-[10px] text-gray-500 uppercase font-medium">{driver.team}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={clsx("w-1.5 h-8 rounded-full opacity-80", driver.color.split(" ")[0])} />
                                    {predictedPos !== null && (
                                        <div className={clsx(
                                            "flex flex-col items-center justify-center px-2 py-1 rounded-lg border text-center min-w-[44px]",
                                            isPerfect
                                                ? "bg-[#E60000] border-[#E60000] text-white shadow-lg shadow-red-600/20"
                                                : isClose
                                                    ? "bg-green-900/40 border-green-500/30 text-green-400"
                                                    : "bg-[#2C2C2E] border-white/5 text-gray-400"
                                        )}>
                                            <div className="text-[8px] font-bold uppercase opacity-80">Twój typ</div>
                                            <div className="text-xs font-black">P{predictedPos}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
