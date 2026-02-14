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
            <div className="text-center p-8 flex flex-col items-center justify-center h-[50vh]">
                <p className="text-gray-500 font-medium mb-4">Race pending or results not available.</p>
                <button
                    onClick={() => router.push("/calendar")}
                    className="px-6 py-3 bg-[#E60000] text-white font-bold rounded-xl shadow-lg shadow-red-900/20 active:scale-95 transition-all"
                >
                    Back to Calendar
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
            <div className="flex h-screen items-center justify-center bg-[#0D0D0D] text-[#E60000]">
              <div className="animate-pulse text-xl font-bold">LOADING RESULTS...</div>
            </div>
        );
    }

    return (
        <div className="pb-24 pt-8 px-4">
            {/* Race Header */}
            <div className="mb-8 text-center">
                <div className="text-xs font-bold text-[#E60000] uppercase tracking-widest mb-2 border border-[#E60000]/20 bg-[#E60000]/5 inline-block px-3 py-1 rounded-full">
                    Round {race.round}
                </div>
                <h1 className="text-3xl font-black mb-1 text-white uppercase leading-none tracking-tight">
                    {race.name}
                </h1>
                <p className="text-gray-500 text-sm font-medium">{race.location}</p>
            </div>

            {/* Friend Scores for This Race */}
            <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">📊 Round Standings</h2>
                <div className="space-y-3">
                    {friendScores.map((friend, index) => (
                        <div
                            key={friend.id}
                            className={clsx(
                                "flex items-center p-4 rounded-2xl border transition-all",
                                index === 0 
                                    ? "bg-gradient-to-r from-[#E60000]/10 to-[#1C1C1E] border-[#E60000] shadow-[0_4px_20px_-5px_rgba(230,0,0,0.3)]" 
                                    : "bg-[#1C1C1E] border-white/5"
                            )}
                        >
                            <div className={clsx(
                                "w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg mr-4",
                                index === 0 ? "bg-[#E60000] text-white" : "bg-[#2C2C2E] text-gray-500"
                            )}>
                                {index + 1}
                            </div>

                            <div className="flex-1">
                                <div className={clsx("font-bold text-lg flex items-center gap-2", index === 0 ? "text-[#E60000]" : "text-white")}>
                                    {friend.name}
                                    {index === 0 && <span>🏆</span>}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {friend.perfectPredictions} perfect {friend.perfectPredictions === 1 ? "pick" : "picks"}
                                </div>
                            </div>

                            <div className="text-right">
                                <div className={clsx("text-2xl font-black", index === 0 ? "text-[#E60000]" : "text-white")}>
                                    {friend.totalPoints}
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase font-medium">points</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Full Classification */}
            <div className="space-y-3">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">🏁 Race Classification</h2>
                {result.fullResults.map((driverId, position) => {
                    const driver = drivers.find((d) => d.id === driverId);
                    if (!driver) return null;

                    // Find all users who predicted this driver
                    const userPredictions = friends.map((friend) => {
                        const userVotes = getCombinedVotes(friend.id);
                        const prediction = userVotes.find(
                            (v: any) =>
                                v.driverId === driverId &&
                                typeof v.raceRound === "string" &&
                                v.raceRound.startsWith(`race-${raceRound}-position-`)
                        );
                        if (!prediction) return null;
                        const predictedPos = parseInt((prediction.raceRound as string).split("-")[3]);
                        const isPerfect = predictedPos === (position + 1);
                        const points = calculateRacePoints(predictedPos - 1, position);
                        return { friend, predictedPos, points, isPerfect };
                    }).filter(Boolean);

                    return (
                        <div
                            key={driverId}
                            className={clsx(
                                "p-4 rounded-xl border transition-all relative overflow-hidden",
                                "bg-[#1C1C1E]",
                                position === 0 ? "border-[#E60000]" : "border-white/5"
                            )}
                        >
                             {/* Position Badge */}
                             {position === 0 && (
                                <div className="absolute top-0 right-0 bg-[#E60000] text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">WINNER</div>
                             )}

                            <div className="flex items-center justify-between mb-3">
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
                                        </div>
                                        <div className="text-[10px] text-gray-500 uppercase font-medium">{driver.team}</div>
                                    </div>
                                </div>
                                
                                <div className={clsx("w-1 h-8 rounded-full opacity-60", driver.color.split(" ")[0])} />
                            </div>

                            {/* User Predictions Visualization */}
                            {userPredictions.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-4 gap-2">
                                    {userPredictions.map((pred) => (
                                        <div
                                            key={pred!.friend.id}
                                            className={clsx(
                                                "flex flex-col items-center justify-center p-1 rounded-lg border",
                                                pred!.isPerfect
                                                    ? "bg-[#E60000]/20 border-[#E60000]/50"
                                                    : "bg-[#2C2C2E] border-white/5 opacity-50"
                                            )}
                                        >
                                            <div className="text-[10px] text-gray-400 font-bold uppercase truncate w-full text-center">
                                                {pred!.friend.name.slice(0, 3)}
                                            </div>
                                            <div className={clsx("text-xs font-black", pred!.isPerfect ? "text-[#E60000]" : "text-gray-500")}>
                                                P{pred!.predictedPos}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
