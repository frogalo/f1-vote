"use client";

import { useStore } from "@/lib/store";
import { drivers, races } from "@/lib/data";
import { raceResults, friends, generateMockVotes } from "@/lib/mockData";
import { calculateRaceScore, calculateRacePoints } from "@/lib/scoring";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";

type Props = {
    raceRound: number;
};

export default function RaceResultsContent({ raceRound }: Props) {
    const { votes, userId: currentUserId, loadFromIndexedDB } = useStore();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadFromIndexedDB().then(() => setLoading(false));
    }, [loadFromIndexedDB]);

    const result = raceResults.find((r) => r.round === raceRound);
    const race = races.find((r) => r.round === raceRound);

    if (!result || !race) {
        return (
            <div className="text-center p-8">
                <p className="text-slate-400">Wyścig nie został jeszcze ukończony</p>
                <button
                    onClick={() => router.push("/calendar")}
                    className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg"
                >
                    ← Wróć do kalendarza
                </button>
            </div>
        );
    }

    // Generate all votes (Me from store, Others from mock)
    const mockVotes = generateMockVotes();

    const getCombinedVotes = (friendId: string) => {
        if (friendId === currentUserId) return votes;
        return mockVotes.filter((v: any) => v.userId === friendId);
    };

    // Calculate scores for each friend for this race
    const friendScores = friends.map((friend) => {
        const userVotes = getCombinedVotes(friend.id);
        const score = calculateRaceScore(friend.id, raceRound, userVotes);
        return {
            ...friend,
            name: friend.id === currentUserId ? `${friend.name} (Ty)` : friend.name,
            ...score,
        };
    }).sort((a, b) => b.totalPoints - a.totalPoints);

    if (loading) {
        return (
            <div className="text-center p-8 text-slate-500 animate-pulse">
                Ładowanie wyników...
            </div>
        );
    }

    return (
        <div className="pb-24">
            {/* Race Header */}
            <div className="mb-6 text-center">
                <div className="text-sm text-slate-500 uppercase mb-1">Runda {race.round}</div>
                <h1 className="text-2xl md:text-3xl font-black mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent uppercase leading-tight">
                    {race.name}
                </h1>
                <p className="text-slate-400 text-sm">{race.location}</p>
            </div>

            {/* Full Classification */}
            <div className="mb-8 space-y-2">
                <h2 className="text-lg font-bold text-slate-300 mb-3">🏁 Pełna Klasyfikacja</h2>
                {result.fullResults.map((driverId, position) => {
                    const driver = drivers.find((d) => d.id === driverId);
                    if (!driver) return null;

                    // Find all users who predicted this driver and their predicted positions
                    const userPredictions = friends
                        .map((friend) => {
                            const userVotes = getCombinedVotes(friend.id);
                            const prediction = userVotes.find(
                                (v: any) =>
                                    v.driverId === driverId &&
                                    typeof v.raceRound === "string" &&
                                    v.raceRound.startsWith(`race-${raceRound}-position-`)
                            );

                            if (!prediction) return null;

                            const predictedPos = parseInt((prediction.raceRound as string).split("-")[3]);
                            const actualPos = position + 1;
                            const isPerfect = predictedPos === actualPos;

                            // Calculate points using centralized scoring function
                            const points = calculateRacePoints(predictedPos - 1, position); // Convert to 0-based

                            return {
                                friend: {
                                    ...friend,
                                    name: friend.id === currentUserId ? `${friend.name} (Ty)` : friend.name
                                },
                                predictedPos,
                                points,
                                isPerfect,
                            };
                        })
                        .filter(Boolean);

                    return (
                        <div
                            key={driverId}
                            className={clsx(
                                "p-4 rounded-xl border-l-4 transition-all",
                                position === 0 && "bg-gradient-to-r from-yellow-600/20 to-orange-600/10 border-yellow-500 shadow-lg",
                                position === 1 && "bg-gradient-to-r from-slate-600/20 to-slate-700/10 border-slate-400",
                                position === 2 && "bg-gradient-to-r from-orange-800/20 to-orange-900/10 border-orange-700",
                                position > 2 && "bg-slate-800/50 border-slate-600"
                            )}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {/* Position */}
                                    <div
                                        className={clsx(
                                            "w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg",
                                            position === 0 && "bg-yellow-500 text-black",
                                            position === 1 && "bg-slate-400 text-black",
                                            position === 2 && "bg-orange-700 text-white",
                                            position > 2 && "bg-slate-700 text-slate-300"
                                        )}
                                    >
                                        {position + 1}
                                    </div>

                                    {/* Driver Info */}
                                    <div>
                                        <div className="font-bold text-lg text-slate-100 flex items-center gap-2">
                                            <span>{driver.country}</span>
                                            <span>{driver.name}</span>
                                            {position === 0 && <span className="text-yellow-500">🏆</span>}
                                        </div>
                                        <div className="text-xs text-slate-400 uppercase">{driver.team}</div>
                                    </div>
                                </div>

                                {/* Team Color */}
                                <div className={clsx("w-2 h-10 rounded-full", driver.color.split(" ")[0])} />
                            </div>

                            {/* User Predictions */}
                            {userPredictions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-700">
                                    <div className="text-xs text-slate-500 w-full mb-1">Typy graczy:</div>
                                    {userPredictions.map((pred) => (
                                        <div
                                            key={pred!.friend.id}
                                            className="group relative"
                                            title={`${pred!.friend.name}: ${pred!.points} pkt`}
                                        >
                                            <div
                                                className={clsx(
                                                    "w-12 h-12 rounded-full flex flex-col items-center justify-center text-xs font-bold border-2 transition-all cursor-help",
                                                    pred!.isPerfect
                                                        ? "bg-green-600 border-green-400 text-white"
                                                        : "bg-slate-700 border-slate-600 text-slate-300"
                                                )}
                                            >
                                                <div className="text-[10px] leading-none">{pred!.friend.name.slice(0, 3)}</div>
                                                <div className="text-base leading-none">{pred!.predictedPos}</div>
                                            </div>
                                            {/* Hover tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                <div className="font-bold text-cyan-400">{pred!.points} pkt</div>
                                                <div className="text-slate-400">Typował: P{pred!.predictedPos}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Friend Scores for This Race */}
            <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-300 mb-3">📊 Wyniki Rundy</h2>
                {friendScores.map((friend, index) => (
                    <div
                        key={friend.id}
                        className={clsx(
                            "p-4 rounded-xl border-l-4 transition-all",
                            index === 0 && "bg-gradient-to-r from-green-600/20 to-emerald-600/10 border-green-500",
                            index > 0 && "bg-slate-800/50 border-slate-600"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            {/* Position */}
                            <div
                                className={clsx(
                                    "w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg",
                                    index === 0 && "bg-green-500 text-black",
                                    index > 0 && "bg-slate-700 text-slate-300"
                                )}
                            >
                                {index + 1}
                            </div>

                            {/* Friend Info */}
                            <div className="flex-1">
                                <div className="font-bold text-lg text-slate-100 flex items-center gap-2">
                                    {friend.name}
                                    {index === 0 && <span className="text-green-500">🏆</span>}
                                </div>
                                <div className="text-xs text-slate-400">
                                    {friend.perfectPredictions} {friend.perfectPredictions === 1 ? "celny typ" : "celnych typów"}
                                </div>
                            </div>

                            {/* Points */}
                            <div className="text-right">
                                <div className="text-2xl font-black text-cyan-400">{friend.totalPoints}</div>
                                <div className="text-xs text-slate-500 uppercase">pkt</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
