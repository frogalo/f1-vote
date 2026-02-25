"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { ChevronLeft } from "lucide-react";
import { getTeamLogo } from "@/lib/data";
import { getLeaderboardUsers } from "@/app/actions/leaderboard";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";

type LeaderboardUser = {
  id: string;
  name: string;
  team: string;
  avatar: string;
  voteCount: number;
};

export default function LeaderboardContent() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    if (!authLoading && currentUser?.isAdmin) {
      router.push("/admin");
      return;
    }

    getLeaderboardUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [currentUser, authLoading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0D0D0D] text-[#E60000]">
        <div className="animate-pulse text-xl font-bold">ŁADOWANIE RANKINGU...</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white font-sans pb-24">
        <div className="p-6 pt-12">
          <h1 className="text-4xl font-black text-white mb-1 tracking-tighter uppercase">
            Ranking
          </h1>
          <p className="text-gray-500 text-sm mt-4">
            Brak zarejestrowanych graczy. Zaproś znajomych!
          </p>
        </div>
      </div>
    );
  }

  // Sort by votes for now (will be replaced with scoring later)
  const sorted = [...users].sort((a, b) => b.voteCount - a.voteCount);

  const top3 = sorted.slice(0, 3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans pb-24">
      {/* Header */}
      <div className="p-6 pt-12">
        <h1 className="text-4xl font-black text-white mb-1 tracking-tighter uppercase relative">
          Ranking
          <div className="absolute -bottom-2 w-12 h-1 bg-[#E60000] rounded-full blur-[2px]"></div>
        </h1>
        <p className="text-gray-500 text-xs mt-2 font-medium">
          {users.length} {users.length === 1 ? 'gracz' : users.length < 5 ? 'graczy' : 'graczy'}
        </p>
      </div>

      {/* Podium Section */}
      {sorted.length >= 2 && (
        <div className="px-4 mb-4">
          <div className="bg-[#1C1C1E] rounded-[2rem] p-6 pb-8 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#2C2C2E] to-[#0D0D0D] opacity-50 z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-900/10 rounded-full blur-[80px] z-0"></div>

            <div className="relative z-10 grid grid-cols-3 gap-2 items-end justify-items-center h-64">
              {podiumOrder.map((u, index) => {
                let rank = 0;
                let isWinner = false;
                let scale = "scale-90";
                let ringColor = "border-slate-500";
                let heightClass = "mb-0";

                if (index === 0) {
                  rank = 2;
                  ringColor = "border-slate-300";
                } else if (index === 1) {
                  rank = 1;
                  isWinner = true;
                  scale = "scale-110 -translate-y-4";
                  ringColor = "border-[#E60000]";
                  heightClass = "mb-8";
                } else if (index === 2) {
                  rank = 3;
                  ringColor = "border-orange-700";
                }

                if (!u) return <div key={index} className="w-full"></div>;

                const isMe = u.id === currentUser?.id;

                return (
                  <div key={u.id} className={`flex flex-col items-center text-center transition-all ${scale} ${heightClass}`}>
                    <div className="font-bold text-gray-300 mb-2 text-sm uppercase tracking-wider">
                      {rank}.
                    </div>
                    <div className={`relative p-1 rounded-full border-2 ${ringColor} ${isWinner ? 'shadow-[0_0_20px_rgba(230,0,0,0.3)]' : ''}`}>
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-800">
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      </div>
                      {isWinner && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#E60000] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-[#0D0D0D] shadow-lg">
                          MISTRZ
                        </div>
                      )}
                    </div>
                    <div className="mt-4 space-y-0.5">
                      <div className="font-bold text-white text-sm md:text-base leading-tight">
                        {isMe ? `${u.name} (Ty)` : u.name}
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <img
                          src={getTeamLogo(u.team)}
                          alt={u.team}
                          className="w-3 h-3 object-contain brightness-0 invert opacity-40"
                        />
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">{u.team}</div>
                      </div>
                      <div className={`font-black text-lg md:text-xl ${isWinner ? 'text-[#E60000]' : 'text-white'}`}>
                        {u.voteCount} <span className="text-[10px] font-normal opacity-70 text-white">TYPÓW</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* List Section */}
      <div className="px-4 space-y-3">
        {sorted.map((u, index) => {
          const rank = index + 1;
          const isMe = u.id === currentUser?.id;

          let borderClass = "border-transparent";
          let bgClass = "bg-[#1C1C1E]/50";
          let numClass = "text-gray-500";

          if (rank === 1) {
            borderClass = "border-l-4 border-[#E60000]";
            bgClass = "bg-gradient-to-r from-[#E60000]/10 to-[#1C1C1E]";
            numClass = "text-[#E60000]";
          } else if (rank === 2) {
            borderClass = "border-l-4 border-[#c0c0c0]";
            bgClass = "bg-gradient-to-r from-[#c0c0c0]/10 to-[#1C1C1E]";
            numClass = "text-[#c0c0c0]";
          } else if (rank === 3) {
            borderClass = "border-l-4 border-[#cd7f32]";
            bgClass = "bg-gradient-to-r from-[#cd7f32]/10 to-[#1C1C1E]";
            numClass = "text-[#cd7f32]";
          }

          return (
            <div
              key={u.id}
              className={`relative flex items-center p-3 rounded-xl ${bgClass} ${borderClass} overflow-hidden group hover:bg-[#252528] transition-all duration-300 border border-t-white/5 border-b-black/50 border-r-white/5`}
            >
              <div className={`w-8 font-black text-xl mr-3 ${numClass} z-10`}>
                {String(rank).padStart(2, '0')}
              </div>

              <div className="relative w-12 h-12 mr-4 flex-shrink-0 z-10">
                <div className={`w-full h-full rounded-full overflow-hidden border-2 ${rank === 1 ? 'border-[#E60000]' : 'border-gray-700'}`}>
                  <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex-1 z-10">
                <div className={clsx("font-bold text-base", isMe ? "text-[#E60000]" : "text-white")}>
                  {isMe ? `${u.name} (Ty)` : u.name}
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={getTeamLogo(u.team)}
                    alt={u.team}
                    className="w-3 h-3 object-contain brightness-0 invert opacity-40"
                  />
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {u.team}
                  </div>
                </div>
              </div>

              <div className="text-right z-10">
                {rank <= 3 && (
                  <div className="text-[10px] text-gray-400 mb-0.5">
                    Miejsce {rank}
                  </div>
                )}
                <div className="font-black text-white text-lg tracking-tight">
                  {u.voteCount} <span className="text-[#E60000] text-xs">TYPÓW</span>
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
