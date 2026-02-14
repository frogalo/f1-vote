"use client";

import { useStore } from "@/lib/store";
import { drivers, races } from "@/lib/data";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import {
  friends,
  generateMockVotes,
  calculateFriendScore,
  raceResults,
  actualSeasonStandings
} from "@/lib/mockData";

type FriendScore = {
  id: string;
  name: string;
  totalPoints: number;
  perfectPredictions: number;
  raceWins: number;
};

export default function LeaderboardContent() {
  const { votes, userId: currentUserId, loadFromIndexedDB, addVote } = useStore();
  const [loading, setLoading] = useState(true);
  const [friendScores, setFriendScores] = useState<FriendScore[]>([]);

  useEffect(() => {
    loadFromIndexedDB().then(() => setLoading(false));
  }, [loadFromIndexedDB]);

  // Load ONLY Jakub's mock data on first run into the store
  useEffect(() => {
    const loadMockData = async () => {
      if (votes.length === 0) {
        // We can import it normally since it's exported from mockData
        const { getJakubVotes } = await import("@/lib/mockData");
        const jakubVotes = getJakubVotes();
        // Since addVote usually adds one by one, we might want to batch, 
        // but for simplicity and correct IDs, we'll use a direct state update if possible or loop.
        // store.addVote sets the current userId correctly.
        for (const vote of jakubVotes) {
          await addVote({
            driverId: vote.driverId,
            raceRound: vote.raceRound,
          });
        }
      }
    };

    if (!loading) {
      loadMockData();
    }
  }, [loading, votes.length, addVote]);

  useEffect(() => {
    // Generate all mock votes once for others
    const allMockVotes = generateMockVotes();

    // Calculate scores for each friend
    const scores = friends.map((friend) => {
      let userVotes;
      if (friend.id === currentUserId) {
        // For current user, use live votes from store
        userVotes = votes;
      } else {
        // For other friends, use static mock votes
        userVotes = allMockVotes.filter((v) => v.userId === friend.id);
      }

      const score = calculateFriendScore(friend.id, userVotes);

      return {
        id: friend.id,
        name: friend.id === currentUserId ? `${friend.name} (Ty)` : friend.name,
        totalPoints: score.totalPoints,
        perfectPredictions: score.perfectPredictions,
        raceWins: score.raceWins,
      };
    });

    // Sort by total points descending
    const sortedScores = scores.sort((a, b) => b.totalPoints - a.totalPoints);
    setFriendScores(sortedScores);
  }, [votes, currentUserId]);

  if (loading) {
    return (
      <div className="text-center p-8 text-slate-500 animate-pulse">
        Ładowanie wyników...
      </div>
    );
  }

  const completedRaces = raceResults.length;
  const totalVotes = votes.filter(v => typeof v.raceRound === "number").length;

  return (
    <div className="pb-24">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent uppercase">
          Wyniki
        </h1>
        <p className="text-slate-400 text-sm">
          Po {completedRaces} wyścigach sezonu 2026
        </p>
      </div>

      {/* Overall Stats Card */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-black text-cyan-400">{totalVotes}</div>
            <div className="text-xs text-slate-400 uppercase">Typy wyścigów</div>
          </div>
          <div>
            <div className="text-2xl font-black text-orange-400">{friends.length}</div>
            <div className="text-xs text-slate-400 uppercase">Graczy</div>
          </div>
          <div>
            <div className="text-2xl font-black text-green-400">{completedRaces}/{races.length}</div>
            <div className="text-xs text-slate-400 uppercase">Ukończono</div>
          </div>
        </div>
      </div>

      {/* Friends Leaderboard */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-300 mb-3">🏆 Klasyfikacja Generalna</h2>

        {friendScores.length === 0 ? (
          <div className="text-center p-8 text-slate-500">
            <div className="text-4xl mb-2">🏁</div>
            <p>Ładowanie danych...</p>
          </div>
        ) : (
          friendScores.map((friend, index) => (
            <div
              key={friend.id}
              className={clsx(
                "p-4 rounded-xl border-l-4 transition-all",
                index === 0 && "bg-gradient-to-r from-yellow-600/20 to-orange-600/10 border-yellow-500 shadow-lg shadow-yellow-500/10",
                index === 1 && "bg-gradient-to-r from-slate-600/20 to-slate-700/10 border-slate-400",
                index === 2 && "bg-gradient-to-r from-orange-800/20 to-orange-900/10 border-orange-700",
                index > 2 && "bg-slate-800/50 border-slate-600"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Position */}
                <div className={clsx(
                  "w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg",
                  index === 0 && "bg-yellow-500 text-black",
                  index === 1 && "bg-slate-400 text-black",
                  index === 2 && "bg-orange-700 text-white",
                  index > 2 && "bg-slate-700 text-slate-300"
                )}>
                  {index + 1}
                </div>

                {/* Friend Info */}
                <div className="flex-1">
                  <div className="font-bold text-lg text-slate-100 flex items-center gap-2">
                    {friend.name}
                    {index === 0 && <span className="text-yellow-500">👑</span>}
                  </div>
                  <div className="flex gap-4 text-xs text-slate-400 mt-1">
                    <span>🎯 {friend.perfectPredictions} celnych</span>
                    <span>🏁 {friend.raceWins} wygranych</span>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <div className="text-2xl font-black text-cyan-400">
                    {friend.totalPoints}
                  </div>
                  <div className="text-xs text-slate-500 uppercase">pkt</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Race Results */}
      <div className="mt-8 space-y-3">
        <h2 className="text-lg font-bold text-slate-300 mb-3">🏁 Wyniki wyścigów</h2>
        <div className="space-y-2">
          {raceResults.map((result) => {
            const race = races.find((r) => r.round === result.round);
            const winnerId = result.fullResults[0];
            const winner = drivers.find((d) => d.id === winnerId);

            if (!race || !winner) return null;

            // Count correct predictions across everyone
            const allMockVotes = generateMockVotes();
            const everyoneVotes = [
              ...votes, // Correct user votes from store
              ...allMockVotes.filter(v => v.userId !== currentUserId) // Others from mock
            ];

            const correctPredictions = everyoneVotes.filter(
              (v) => v.raceRound === `race-${result.round}-position-1` && v.driverId === winnerId
            ).length;

            return (
              <Link
                key={result.round}
                href={`/race/${result.round}/results`}
                className="block p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-xs font-black text-white">
                      {result.round}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-200">
                        {race.name}
                      </div>
                      <div className="text-xs text-slate-400">{race.location}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-green-400 flex items-center gap-1">
                      <span>{winner.country}</span>
                      <span>{winner.name}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {correctPredictions}/{friends.length} celnych
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Current Season Standings */}
      <div className="mt-8 space-y-3">
        <h2 className="text-lg font-bold text-slate-300 mb-3">🏆 Aktualna klasyfikacja kierowców</h2>
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
          <p className="text-xs text-slate-400 mb-3 text-center">Po {completedRaces} wyścigach</p>
          <div className="space-y-2">
            {actualSeasonStandings.map((driverId, idx) => {
              const driver = drivers.find((d) => d.id === driverId);
              if (!driver) return null;

              return (
                <div
                  key={driverId}
                  className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50"
                >
                  <div className={clsx(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                    idx === 0 && "bg-yellow-500 text-black",
                    idx === 1 && "bg-slate-400 text-black",
                    idx === 2 && "bg-orange-700 text-white",
                    idx > 2 && "bg-slate-700 text-slate-300"
                  )}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-200 flex items-center gap-1">
                      <span>{driver.country}</span>
                      <span>{driver.name}</span>
                    </div>
                    <div className="text-xs text-slate-500">{driver.team}</div>
                  </div>
                  <div className={clsx(
                    "w-2 h-2 rounded-full",
                    driver.color.split(" ")[0]
                  )} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
