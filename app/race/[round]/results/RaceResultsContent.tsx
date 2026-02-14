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
            // name: friend.id === currentUserId ? `${friend.name} (Ty)` : friend.name, // Display moved to UI
            isCurrentUser: friend.id === currentUserId,
            ...score,
        };
    }).sort((a, b) => b.totalPoints - a.totalPoints);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0D0D0D] text-[#E60000]">
              <div className="animate-pulse text-xl font-bold">ŁADOWANIE WYNIKÓW...</div>
            </div>
        );
    }

    const top3 = friendScores.slice(0, 3);
    const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean); // 2nd, 1st, 3rd

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

            {/* Podium Section */}
            <div className="mb-8">
                <div className="bg-[#1C1C1E] rounded-[2rem] p-6 pb-8 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#2C2C2E] to-[#0D0D0D] opacity-50 z-0"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-900/10 rounded-full blur-[60px] z-0"></div>

                    <div className="relative z-10 grid grid-cols-3 gap-2 items-end justify-items-center h-56">
                        {podiumOrder.map((user, index) => {
                             let rank = 0;
                             let isWinner = false;
                             let scale = "scale-90";
                             let ringColor = "border-slate-500";
                             let heightClass = "mb-0";
                             
                             // podiumOrder is [2nd, 1st, 3rd]
                             if (index === 0) { // 2nd
                                rank = 2;
                                ringColor = "border-slate-300";
                             } else if (index === 1) { // 1st
                                rank = 1;
                                isWinner = true;
                                scale = "scale-110 -translate-y-2";
                                ringColor = "border-[#E60000]";
                                heightClass = "mb-6";
                             } else if (index === 2) { // 3rd
                                rank = 3;
                                ringColor = "border-orange-700";
                             }

                             if (!user) return <div key={index} className="w-full"></div>;

                             return (
                                <div key={user.id} className={`flex flex-col items-center text-center transition-all ${scale} ${heightClass}`}>
                                    <div className="font-bold text-gray-300 mb-1 text-[10px] uppercase tracking-wider">
                                        {rank === 1 ? '1.' : rank === 2 ? '2.' : '3.'}
                                    </div>
                                    <div className={`relative p-1 rounded-full border-2 ${ringColor} ${isWinner ? 'shadow-[0_0_15px_rgba(230,0,0,0.4)]' : ''}`}>
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-gray-800">
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        </div>
                                        {isWinner && (
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#E60000] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-[#0D0D0D]">
                                                WYGRANA
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-2 text-white font-bold text-xs leading-tight">
                                        {user.name}
                                    </div>
                                    <div className={`font-black text-sm md:text-base ${isWinner ? 'text-[#E60000]' : 'text-gray-400'}`}>
                                        {user.totalPoints} <span className="text-[8px]">PKT</span>
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                </div>
            </div>

            {/* Friend Scores List */}
            <div className="mb-10">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">📊 Klasyfikacja</h2>
                <div className="space-y-3">
                    {friendScores.map((friend, index) => {
                        const isTop = index === 0;
                        const isMe = friend.isCurrentUser;
                        return (
                            <div
                                key={friend.id}
                                className={clsx(
                                    "flex items-center p-3 rounded-2xl border transition-all relative overflow-hidden",
                                    isMe 
                                        ? "bg-gradient-to-r from-[#E60000]/20 to-[#1C1C1E] border-[#E60000] shadow-[0_0_15px_-5px_rgba(230,0,0,0.3)]" 
                                        : isTop 
                                            ? "bg-[#1C1C1E] border-[#E60000]/50" 
                                            : "bg-[#1C1C1E] border-white/5"
                                )}
                            >
                                <div className={clsx(
                                    "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm mr-3 flex-shrink-0",
                                    isTop ? "bg-[#E60000] text-white" : "bg-[#2C2C2E] text-gray-500"
                                )}>
                                    {index + 1}
                                </div>
                                
                                <div className="relative w-10 h-10 mr-3 flex-shrink-0">
                                    <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover border border-white/10" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className={clsx(
                                        "font-bold text-base flex items-center gap-2 truncate", 
                                        isMe ? "text-[#E60000]" : "text-white"
                                    )}>
                                        {friend.name} {isMe && "(Ty)"}
                                        {isTop && <span>🏆</span>}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">
                                        {friend.perfectPredictions} {friend.perfectPredictions === 1 ? "idealny typ" : "idealnych typów"}
                                    </div>
                                </div>

                                <div className="text-right flex-shrink-0 pl-2">
                                    <div className={clsx("text-xl font-black", (isTop || isMe) ? "text-[#E60000]" : "text-white")}>
                                        {friend.totalPoints}
                                    </div>
                                    <div className="text-[10px] text-gray-500 uppercase font-medium">pkt</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Full Classification */}
            <div className="space-y-3">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">🏁 Wyniki i Typy</h2>
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
                        
                        // Scoring Logic:
                        // Exact match (diff 0) -> 5pts
                        // Diff 1 -> 4pts
                        // ...
                        const points = calculateRacePoints(predictedPos - 1, position);
                        const isPerfect = points === 5;
                        const isScoring = points > 0;

                        return { friend, predictedPos, points, isPerfect, isScoring };
                    }).filter(Boolean);

                    return (
                        <div
                            key={driverId}
                            className={clsx(
                                "p-4 rounded-xl border transition-all relative overflow-hidden",
                                "bg-[#1C1C1E]",
                                position === 0 ? "border-[#E60000] bg-gradient-to-br from-[#E60000]/10 to-[#1C1C1E]" : "border-white/5"
                            )}
                        >
                             {/* Position Badge & Driver */}
                             <div className="flex items-center justify-between mb-3 relative z-10">
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
                                        <div className="text-[10px] text-gray-500 uppercase font-medium">{driver.team}</div>
                                    </div>
                                </div>
                                
                                <div className={clsx("w-1.5 h-8 rounded-full opacity-80", driver.color.split(" ")[0])} />
                            </div>

                            {/* User Predictions Visualization */}
                            {userPredictions.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {userPredictions.map((pred) => {
                                        // Dynamic Styling based on points
                                        let bgClass = "bg-[#2C2C2E] opacity-40";
                                        let textClass = "text-gray-500";
                                        let borderClass = "border-transparent";

                                        if (pred!.isPerfect) {
                                            bgClass = "bg-[#E60000] text-white shadow-lg shadow-red-600/20"; // Perfect Match (5 pts)
                                            textClass = "text-white";
                                            borderClass = "border-[#E60000]";
                                        } else if (pred!.points >= 3) {
                                            bgClass = "bg-green-900/40 text-green-400"; // Close call (3-4 pts)
                                            textClass = "text-green-400";
                                            borderClass = "border-green-500/30";
                                        } else if (pred!.points > 0) {
                                            bgClass = "bg-yellow-900/30 text-yellow-500"; // Some points (1-2 pts)
                                            textClass = "text-yellow-500";
                                            borderClass = "border-yellow-500/20";
                                        }

                                        return (
                                            <div
                                                key={pred!.friend.id}
                                                className={clsx(
                                                    "flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all",
                                                    bgClass, borderClass
                                                )}
                                            >
                                                <div className={clsx("text-[9px] font-bold uppercase truncate w-full text-center opacity-80", pred!.isPerfect ? "text-white" : "text-gray-400")}>
                                                    {pred!.friend.name.slice(0, 3)}
                                                </div>
                                                <div className={clsx("text-xs font-black", textClass)}>
                                                    P{pred!.predictedPos}
                                                </div>
                                                {pred!.points > 0 && <div className="text-[8px] font-bold opacity-70">+{pred!.points}</div>}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
