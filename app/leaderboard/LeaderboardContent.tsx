"use client";

import { useEffect, useState, useRef } from "react";
import { clsx } from "clsx";
import { getTeamLogo } from "@/lib/data";
import { getLeaderboardUsers } from "@/app/actions/leaderboard";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import {
  Target,
  Flame,
  ChevronDown,
  Crown,
  Medal,
  TrendingUp,
  Zap,
} from "lucide-react";

type LeaderboardUser = {
  id: string;
  name: string;
  team: string;
  avatar: string;
  voteCount: number;
  totalPoints: number;
  perfectPredictions: number;
  racesScored: number;
  hasScores: boolean;
};

function AnimatedNumber({
  value,
  duration = 1200,
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) {
        ref.current = requestAnimationFrame(tick);
      }
    }

    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value, duration]);

  return <>{display}</>;
}

export default function LeaderboardContent() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [podiumReady, setPodiumReady] = useState(false);

  useEffect(() => {
    if (!authLoading && currentUser?.isAdmin) {
      router.push("/admin");
      return;
    }

    getLeaderboardUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [currentUser, authLoading, router]);

  useEffect(() => {
    if (!loading && users.length > 0) {
      const t = setTimeout(() => setPodiumReady(true), 150);
      return () => clearTimeout(t);
    }
  }, [loading, users]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0D0D0D]">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#E60000]/20 border-t-[#E60000]" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border border-[#E60000]/10" />
        </div>
        <div className="mt-6 animate-pulse text-sm font-bold uppercase tracking-[0.3em] text-[#E60000]/80">
          Ładowanie rankingu
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] pb-24 font-sans text-white">
        <div className="p-6 pt-12">
          <h1 className="mb-1 text-4xl font-black uppercase tracking-tighter text-white">
            Ranking
          </h1>
          <p className="mt-4 text-sm text-gray-500">
            Brak zarejestrowanych graczy. Zaproś znajomych!
          </p>
        </div>
      </div>
    );
  }

  const hasScores = users.some((u) => u.hasScores);

  const sorted = [...users].sort((a, b) => {
    if (hasScores) {
      if (b.totalPoints !== a.totalPoints)
        return b.totalPoints - a.totalPoints;
      if (b.perfectPredictions !== a.perfectPredictions)
        return b.perfectPredictions - a.perfectPredictions;
      return b.voteCount - a.voteCount;
    }
    return b.voteCount - a.voteCount;
  });

  const maxPoints = sorted[0]
    ? hasScores
      ? sorted[0].totalPoints
      : sorted[0].voteCount
    : 1;

  const top3 = sorted.slice(0, 3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  const totalVotes = users.reduce((s, u) => s + u.voteCount, 0);
  const totalPerfect = users.reduce(
    (s, u) => s + u.perfectPredictions,
    0
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-28 font-sans text-white">
      {/* ── HEADER ── */}
      <div className="relative overflow-hidden px-6 pb-4 pt-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#E60000]/8 blur-[100px]" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E60000]/20 bg-[#E60000]/10 px-3 py-1">
            <Flame className="h-3 w-3 text-[#E60000]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E60000]">
              Sezon 2025
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Ranking
          </h1>
          <p className="mt-1 text-xs font-medium text-gray-500">
            {users.length} graczy
            {hasScores && (
              <span className="ml-2 text-[#E60000]">
                · {sorted[0]?.racesScored || 0} rundy
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ── QUICK STATS ── */}
      <div className="mb-4 grid grid-cols-3 gap-2 px-4">
        {[
          {
            label: "Łącznie typów",
            value: totalVotes,
            icon: <Zap className="h-3.5 w-3.5 text-[#E60000]" />,
          },
          {
            label: "Trafień idealnych",
            value: totalPerfect,
            icon: <Target className="h-3.5 w-3.5 text-green-400" />,
          },
          {
            label: "Lider",
            value: hasScores ? sorted[0]?.totalPoints || 0 : sorted[0]?.voteCount || 0,
            icon: <Crown className="h-3.5 w-3.5 text-yellow-400" />,
            suffix: hasScores ? " pkt" : "",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/[0.06] bg-[#1C1C1E] p-3 text-center"
          >
            <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
              {stat.icon}
            </div>
            <div className="text-lg font-black tabular-nums text-white">
              <AnimatedNumber value={stat.value} />
              {stat.suffix && (
                <span className="text-[9px] text-gray-500">
                  {stat.suffix}
                </span>
              )}
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── PODIUM ── */}
      {sorted.length >= 2 && (
        <div className="mb-6 px-4">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#1C1C1E] p-6 pb-8">
            {/* BG layers */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#222225] to-[#0D0D0D] opacity-60" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E60000]/8 blur-[100px]" />

            {/* Decorative lines */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[2px] px-8">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] rounded-t bg-white/[0.03]"
                  style={{
                    height: `${Math.sin((i / 40) * Math.PI) * 60 + 4}px`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 grid h-72 grid-cols-3 items-end justify-items-center gap-2">
              {podiumOrder.map((u, index) => {
                if (!u) return <div key={index} />;

                const rank = index === 0 ? 2 : index === 1 ? 1 : 3;
                const isWinner = rank === 1;
                const isMe = u.id === currentUser?.id;
                const scoreValue = hasScores
                  ? u.totalPoints
                  : u.voteCount;
                const scoreLabel = hasScores ? "PKT" : "TYPÓW";

                const podiumHeight =
                  rank === 1
                    ? "h-28"
                    : rank === 2
                      ? "h-20"
                      : "h-14";
                const podiumColor =
                  rank === 1
                    ? "from-[#E60000]/40 to-[#E60000]/10 border-[#E60000]/30"
                    : rank === 2
                      ? "from-gray-400/20 to-gray-400/5 border-gray-400/20"
                      : "from-orange-700/20 to-orange-700/5 border-orange-700/20";

                const delayClass =
                  rank === 1
                    ? "delay-300"
                    : rank === 2
                      ? "delay-150"
                      : "delay-[450ms]";

                return (
                  <div
                    key={u.id}
                    className={clsx(
                      "flex flex-col items-center text-center transition-all duration-700 ease-out",
                      podiumReady
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0",
                      delayClass
                    )}
                  >
                    {/* Crown for winner */}
                    {isWinner && (
                      <div className="mb-1 animate-bounce">
                        <Crown className="h-5 w-5 text-[#E60000] drop-shadow-[0_0_8px_rgba(230,0,0,0.5)]" />
                      </div>
                    )}

                    {/* Avatar */}
                    <div
                      className={clsx(
                        "relative rounded-full p-[3px] transition-all",
                        isWinner
                          ? "bg-gradient-to-b from-[#E60000] to-[#E60000]/50 shadow-[0_0_30px_rgba(230,0,0,0.3)]"
                          : rank === 2
                            ? "bg-gradient-to-b from-gray-300 to-gray-600"
                            : "bg-gradient-to-b from-orange-600 to-orange-900"
                      )}
                    >
                      <div
                        className={clsx(
                          "overflow-hidden rounded-full bg-gray-800",
                          isWinner
                            ? "h-[72px] w-[72px]"
                            : "h-[60px] w-[60px]"
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="mt-3 space-y-0.5">
                      <div
                        className={clsx(
                          "text-sm font-bold leading-tight",
                          isMe ? "text-[#E60000]" : "text-white"
                        )}
                      >
                        {u.name}
                        {isMe && (
                          <span className="ml-1 text-[9px] text-[#E60000]/60">
                            (Ty)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getTeamLogo(u.team)}
                          alt=""
                          className="h-3 w-3 object-contain opacity-40 brightness-0 invert"
                        />
                        <span className="text-[9px] uppercase tracking-widest text-gray-500">
                          {u.team}
                        </span>
                      </div>
                      <div
                        className={clsx(
                          "text-xl font-black",
                          isWinner ? "text-[#E60000]" : "text-white"
                        )}
                      >
                        <AnimatedNumber value={scoreValue} />
                        <span className="ml-1 text-[9px] font-bold text-gray-500">
                          {scoreLabel}
                        </span>
                      </div>
                      {hasScores && u.perfectPredictions > 0 && (
                        <div className="text-[9px] font-bold text-green-400">
                          ✨ {u.perfectPredictions} trafień
                        </div>
                      )}
                    </div>

                    {/* Podium bar */}
                    <div
                      className={clsx(
                        "mt-3 w-full rounded-t-2xl border-t bg-gradient-to-b transition-all duration-700",
                        podiumColor,
                        podiumHeight,
                        podiumReady ? "scale-y-100" : "scale-y-0"
                      )}
                      style={{ transformOrigin: "bottom" }}
                    >
                      <div className="flex h-full items-start justify-center pt-3">
                        <span
                          className={clsx(
                            "text-2xl font-black",
                            rank === 1
                              ? "text-[#E60000]/60"
                              : rank === 2
                                ? "text-gray-400/40"
                                : "text-orange-700/40"
                          )}
                        >
                          {rank}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}


      {/* ── FULL LIST ── */}
      <div className="space-y-1.5 px-4">
        {sorted.map((u, index) => {
          const rank = index + 1;
          const isMe = u.id === currentUser?.id;
          const isExpanded = expandedUser === u.id;
          const scoreValue = hasScores ? u.totalPoints : u.voteCount;
          const scoreLabel = hasScores ? "PKT" : "TYPÓW";
          const barWidth =
            maxPoints > 0 ? (scoreValue / maxPoints) * 100 : 0;

          const avgPoints =
            u.racesScored > 0
              ? (u.totalPoints / u.racesScored).toFixed(1)
              : "—";

          return (
            <div key={u.id}>
              <button
                onClick={() =>
                  setExpandedUser(isExpanded ? null : u.id)
                }
                className={clsx(
                  "group relative flex w-full items-center overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-300 active:scale-[0.98]",
                  isMe
                    ? "border-[#E60000]/25 bg-gradient-to-r from-[#E60000]/10 to-[#1A1A1D]"
                    : rank <= 3
                      ? "border-white/[0.06] bg-[#1A1A1D] hover:bg-[#222225]"
                      : "border-white/[0.04] bg-[#161618] hover:bg-[#1E1E21]"
                )}
              >
                {/* Left accent */}
                {(isMe || rank <= 3) && (
                  <div
                    className={clsx(
                      "absolute bottom-0 left-0 top-0 w-[3px] rounded-full",
                      rank === 1
                        ? "bg-[#E60000]"
                        : rank === 2
                          ? "bg-gray-400"
                          : rank === 3
                            ? "bg-orange-600"
                            : isMe
                              ? "bg-[#E60000]/50"
                              : ""
                    )}
                  />
                )}

                {/* Progress bar background */}
                <div
                  className="pointer-events-none absolute bottom-0 left-0 top-0 transition-all duration-1000 ease-out"
                  style={{ width: `${barWidth}%` }}
                >
                  <div
                    className={clsx(
                      "h-full",
                      rank === 1
                        ? "bg-[#E60000]/[0.06]"
                        : "bg-white/[0.02]"
                    )}
                  />
                </div>

                {/* Rank */}
                <div
                  className={clsx(
                    "relative z-10 mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black",
                    rank === 1
                      ? "bg-[#E60000] text-white shadow-lg shadow-red-900/30"
                      : rank === 2
                        ? "bg-gray-500/80 text-white"
                        : rank === 3
                          ? "bg-orange-700/80 text-white"
                          : "bg-[#2C2C2E] text-gray-500"
                  )}
                >
                  {rank}
                </div>

                {/* Avatar */}
                <div
                  className={clsx(
                    "relative z-10 mr-3.5 h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 bg-gray-800",
                    rank === 1
                      ? "border-[#E60000]/50"
                      : isMe
                        ? "border-[#E60000]/30"
                        : "border-white/10"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="relative z-10 min-w-0 flex-1">
                  <div
                    className={clsx(
                      "truncate text-sm font-bold",
                      isMe ? "text-[#E60000]" : "text-white"
                    )}
                  >
                    {u.name}
                    {isMe && (
                      <span className="ml-1.5 rounded-md bg-[#E60000]/20 px-1.5 py-0.5 text-[9px] font-black text-[#E60000]">
                        TY
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getTeamLogo(u.team)}
                      alt=""
                      className="h-3 w-3 object-contain opacity-40 brightness-0 invert"
                    />
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                      {u.team}
                    </span>
                  </div>
                </div>

                {/* Score + chevron */}
                <div className="relative z-10 flex items-center gap-2">
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-lg font-black tabular-nums text-white">
                        {scoreValue}
                      </span>
                      <span className="text-[9px] font-bold text-[#E60000]">
                        {scoreLabel}
                      </span>
                    </div>
                    {hasScores && u.perfectPredictions > 0 && (
                      <div className="text-[9px] font-bold text-green-400/80">
                        ✨ {u.perfectPredictions}
                      </div>
                    )}
                  </div>
                  <ChevronDown
                    className={clsx(
                      "h-4 w-4 text-gray-600 transition-transform duration-300",
                      isExpanded && "rotate-180 text-gray-400"
                    )}
                  />
                </div>
              </button>

              {/* ── EXPANDED STATS ── */}
              <div
                className={clsx(
                  "grid transition-all duration-300 ease-in-out",
                  isExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="mx-2 mt-1 rounded-2xl border border-white/[0.06] bg-[#141416] p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          label: "Łącznie typów",
                          value: u.voteCount.toString(),
                          icon: (
                            <Zap className="h-3 w-3 text-[#E60000]" />
                          ),
                        },
                        {
                          label: "Trafienia idealne",
                          value: u.perfectPredictions.toString(),
                          icon: (
                            <Target className="h-3 w-3 text-green-400" />
                          ),
                        },
                        {
                          label: "Rundy",
                          value: u.racesScored.toString(),
                          icon: (
                            <Medal className="h-3 w-3 text-yellow-400" />
                          ),
                        },
                        {
                          label: "Średnia / rundę",
                          value: avgPoints,
                          icon: (
                            <TrendingUp className="h-3 w-3 text-blue-400" />
                          ),
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-xl bg-[#1C1C1E] p-3"
                        >
                          <div className="mb-1 flex items-center gap-1.5">
                            {stat.icon}
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
                              {stat.label}
                            </span>
                          </div>
                          <div className="text-xl font-black tabular-nums text-white">
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Points bar visual */}
                    {hasScores && (
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-gray-500">
                          <span>Punkty do lidera</span>
                          <span className="tabular-nums text-white">
                            {u.totalPoints} / {maxPoints}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/5">
                          <div
                            className={clsx(
                              "h-full rounded-full transition-all duration-700 ease-out",
                              rank === 1
                                ? "bg-gradient-to-r from-[#E60000] to-[#ff4444]"
                                : isMe
                                  ? "bg-gradient-to-r from-[#E60000]/80 to-[#E60000]/50"
                                  : "bg-gradient-to-r from-gray-500 to-gray-600"
                            )}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}