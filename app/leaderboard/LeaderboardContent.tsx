"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { friends, generateMockVotes, calculateFriendScore } from "@/lib/mockData";

type FriendScore = {
  id: string;
  name: string;
  team: string;
  avatar: string;
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

      // We need to fetch team and avatar from the friend object in mockData
      // But friends here is already the imported array which we updated
      // We need to make sure we access the updated properties
      const friendData = friends.find(f => f.id === friend.id);

      return {
        id: friend.id,
        name: friend.id === currentUserId ? `${friend.name} (Ty)` : friend.name,
        team: friendData?.team || "Unknown Team",
        avatar: friendData?.avatar || `https://ui-avatars.com/api/?name=${friend.name}&background=random`,
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
      <div className="flex h-screen items-center justify-center bg-[#0D0D0D] text-[#E60000]">
        <div className="animate-pulse text-xl font-bold">LOADING RESULTS...</div>
      </div>
    );
  }

  const top3 = friendScores.slice(0, 3);
  // Reorder for podium: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans pb-24">
      {/* Header */}
      <div className="p-6 pt-12">
        <button className="text-[#E60000] mb-4 text-2xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-4xl font-black text-white mb-1 tracking-tighter uppercase relative">
          Rank
          <div className="absolute -bottom-2 w-12 h-1 bg-[#E60000] rounded-full blur-[2px]"></div>
        </h1>
        <p className="text-gray-500 text-xs mt-2 font-medium">
          Last Updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}, {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Podium Section */}
      <div className="px-4 mb-4">
        <div className="bg-[#1C1C1E] rounded-[2rem] p-6 pb-8 border border-white/5 relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#2C2C2E] to-[#0D0D0D] opacity-50 z-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-900/10 rounded-full blur-[80px] z-0"></div>

          <div className="relative z-10 grid grid-cols-3 gap-2 items-end justify-items-center h-64">
            {podiumOrder.map((user, index) => {
              // Determine actual rank based on order in podium array
              // podiumOrder is [2nd, 1st, 3rd]
              // So index 0 is rank 2, index 1 is rank 1, index 2 is rank 3
              let rank = 0;
              let isWinner = false;
              let scale = "scale-90";
              let ringColor = "border-slate-500";
              let glowColor = "shadow-slate-500/20";
              let heightClass = "mb-0";
              
              if (index === 0) { // 2nd place
                rank = 2;
                ringColor = "border-slate-300";
              } else if (index === 1) { // 1st place
                rank = 1;
                isWinner = true;
                scale = "scale-110 -translate-y-4";
                ringColor = "border-[#E60000]"; // Red
                glowColor = "shadow-[#E60000]/40";
                heightClass = "mb-8";
              } else if (index === 2) { // 3rd place
                rank = 3;
                ringColor = "border-orange-700";
                glowColor = "shadow-orange-700/20";
              }

              if (!user) return <div key={index} className="w-full"></div>;

              return (
                <div key={user.id} className={`flex flex-col items-center text-center transition-all ${scale} ${heightClass}`}>
                  <div className="font-bold text-gray-300 mb-2 text-sm uppercase tracking-wider">
                    {rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd'}
                  </div>
                  
                  <div className={`relative p-1 rounded-full border-2 ${ringColor} ${isWinner ? 'shadow-[0_0_20px_rgba(230,0,0,0.3)]' : ''}`}>
                     <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-800">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                     </div>
                     {isWinner && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#E60000] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-[#0D0D0D] shadow-lg">
                          KING
                        </div>
                     )}
                  </div>

                  <div className="mt-4 space-y-0.5">
                    <div className="font-bold text-white text-sm md:text-base leading-tight">
                      {user.name.split(' ')[0]}<br/>
                      <span className="text-gray-400 font-medium text-xs">{user.name.split(' ').slice(1).join(' ') || ''}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">{user.team}</div>
                    <div className={`font-black text-lg md:text-xl ${isWinner ? 'text-[#E60000]' : 'text-white'}`}>
                      {user.totalPoints} <span className="text-[10px] font-normal opacity-70 text-white">XP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="px-4 space-y-3">
        {friendScores.map((user, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;
          
          let borderClass = "border-transparent";
          let bgClass = "bg-[#1C1C1E]";
          let numClass = "text-white";
          
          if (rank === 1) {
            borderClass = "border-l-4 border-[#E60000]"; // Red
            bgClass = "bg-gradient-to-r from-[#E60000]/10 to-[#1C1C1E]";
            numClass = "text-[#E60000]";
          } else if (rank === 2) {
             borderClass = "border-l-4 border-[#c0c0c0]"; // Silver (approx)
             bgClass = "bg-gradient-to-r from-[#c0c0c0]/10 to-[#1C1C1E]";
             numClass = "text-[#c0c0c0]";
          } else if (rank === 3) {
             borderClass = "border-l-4 border-[#cd7f32]"; // Bronze
             bgClass = "bg-gradient-to-r from-[#cd7f32]/10 to-[#1C1C1E]";
             numClass = "text-[#cd7f32]";
          } else {
             bgClass = "bg-[#1C1C1E]/50";
             numClass = "text-gray-500";
          }

          return (
            <div 
              key={user.id}
              className={`relative flex items-center p-3 rounded-xl ${bgClass} ${borderClass} overflow-hidden group hover:bg-[#252528] transition-all duration-300 border border-t-white/5 border-b-black/50 border-r-white/5`}
            >
              <div className={`w-8 font-black text-xl mr-3 ${numClass} z-10`}>
                {String(rank).padStart(2, '0')}
              </div>
              
              <div className="relative w-12 h-12 mr-4 flex-shrink-0 z-10">
                <div className={`w-full h-full rounded-full overflow-hidden border-2 ${rank === 1 ? 'border-[#E60000]' : 'border-gray-700'}`}>
                   <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex-1 z-10">
                <div className="font-bold text-white text-base">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {user.team}
                </div>
              </div>

              <div className="text-right z-10">
                 {rank <= 3 && (
                   <div className="text-[10px] text-gray-400 mb-0.5">
                     Rank {rank}
                   </div>
                 )}
                 <div className="font-black text-white text-lg tracking-tight">
                   {user.totalPoints} <span className="text-[#E60000] text-xs">XP</span>
                 </div>
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
