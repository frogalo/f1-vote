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
  User,
  Trophy,
} from "lucide-react";

type LeaderboardUser = {
  id: string;
  name: string;
  team: string;
  avatar: string;
  favoriteDriver: { name: string; slug: string } | null;
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

const getTeamColor = (team: string): string => {
  const colors: Record<string, string> = {
    "Alpine": "#0090FF",
    "Aston Martin": "#037A68",
    "Williams": "#005AFF",
    "Audi": "#B2B2B2",
    "Cadillac": "#E5A93C",
    "Ferrari": "#EF1A2D",
    "Haas": "#EA1D2D",
    "McLaren": "#FF8700",
    "Mercedes": "#00A19C",
    "Racing Bulls": "#0060FF",
    "Red Bull Racing": "#3671C6"
  };
  return colors[team] || "#E60000";
};

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
      <div className="flex h-screen flex-col items-center justify-center bg-brand-dark">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-brand-red/20 border-t-brand-red" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border border-brand-red/10" />
        </div>
        <div className="mt-6 animate-pulse text-sm font-bold uppercase tracking-[0.3em] text-brand-red/80">
          Ładowanie rankingu
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="min-h-screen bg-brand-dark pb-24 font-sans text-white">
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
    <div className="min-h-screen bg-brand-dark pb-28 font-sans text-white">
      {/* ── HEADER ── */}
      <div className="relative overflow-hidden px-6 pb-4 pt-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-red/8 blur-[100px]" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-red/20 bg-brand-red/10 px-3 py-1">
            <Flame className="h-3 w-3 text-brand-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red">
              Sezon 2026
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Ranking
          </h1>
          <p className="mt-1 text-xs font-medium text-gray-500">
            {users.length} graczy
            {hasScores && (
              <span className="ml-2 text-brand-red">
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
            icon: <Zap className="h-3.5 w-3.5 text-brand-red" />,
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
            className="rounded-2xl border border-white/6 bg-brand-card p-3 text-center"
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
          <div className="relative overflow-hidden rounded-3xl border border-white/6 bg-brand-card p-6 pb-8">
            {/* BG layers */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#222225] to-brand-dark opacity-60" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red/8 blur-[100px]" />

            {/* Decorative lines */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0.5 px-8">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-t bg-white/3"
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
                    ? "from-brand-red/40 to-brand-red/10 border-brand-red/30"
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
                        <Crown className="h-5 w-5 text-brand-red drop-shadow-[0_0_8px_rgba(230,0,0,0.5)]" />
                      </div>
                    )}

                    {/* Avatar */}
                    <div
                      className={clsx(
                        "relative rounded-full p-0.75 transition-all",
                        isWinner
                          ? "bg-linear-to-b from-brand-red to-brand-red/50 shadow-[0_0_30px_rgba(230,0,0,0.3)]"
                          : rank === 2
                            ? "bg-linear-to-b from-gray-300 to-gray-600"
                            : "bg-linear-to-b from-orange-600 to-orange-900"
                      )}
                    >
                      <div
                        className={clsx(
                          "overflow-hidden rounded-full bg-gray-800",
                          isWinner
                            ? "h-18 w-18"
                            : "h-15 w-15"
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
                          isMe ? "text-brand-red" : "text-white"
                        )}
                      >
                        {u.name}
                        {isMe && (
                          <span className="ml-1 text-[9px] text-brand-red/60">
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
                          isWinner ? "text-brand-red" : "text-white"
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
                        "mt-3 w-full rounded-t-2xl border-t bg-linear-to-b transition-all duration-700",
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
                              ? "text-brand-red/60"
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
<div className="space-y-3 px-3 sm:px-4">
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

    const teamColor = getTeamColor(u.team);

    return (
      <div key={u.id} className="group">
        <button
          onClick={() =>
            setExpandedUser(isExpanded ? null : u.id)
          }
          className={clsx(
            "relative w-full overflow-hidden rounded-2xl border text-left transition-all duration-300 active:scale-[0.99]",
            "hover:border-white/20 hover:bg-white/2 hover:shadow-lg hover:shadow-black/50",
            isMe
              ? "border-white/10 bg-linear-to-r from-white/4 to-white/1"
              : "border-white/6 bg-[#0E0E10]"
          )}
          style={{
            boxShadow: isMe ? `inset 0 0 16px 1px ${teamColor}18, 0 4px 20px -2px rgba(0, 0, 0, 0.5)` : undefined
          }}
        >
          {/* Subtle colored glow backdrop matching the team color */}
          <div
            className="absolute -right-24 -top-24 h-48 w-48 rounded-full pointer-events-none blur-[60px] opacity-10 transition-opacity duration-300 group-hover:opacity-15"
            style={{ backgroundColor: teamColor }}
          />

          {/* Left colored border strip representing team color */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{
              backgroundColor: teamColor,
              boxShadow: `0 0 8px ${teamColor}80`
            }}
          />

          <div className="p-4 sm:p-5 pl-5 sm:pl-6">
            <div className="flex items-center justify-between gap-3">
              {/* Left Side: Rank + Avatar + Name Details */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                {/* 1. Rank Indicator */}
                <div className="w-8 sm:w-10 shrink-0 flex flex-col items-center justify-center text-center">
                  <span
                    className={clsx(
                      "text-2xl sm:text-3xl font-black italic tracking-tighter select-none leading-none",
                      rank === 1
                        ? "text-transparent bg-clip-text bg-linear-to-b from-[#FFF099] to-[#D4AF37] filter drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]"
                        : rank === 2
                          ? "text-transparent bg-clip-text bg-linear-to-b from-white to-[#A8A8A8]"
                          : rank === 3
                            ? "text-transparent bg-clip-text bg-linear-to-b from-[#FFD2B2] to-[#C27D38]"
                            : "text-[#4A4A4F] group-hover:text-gray-400 transition-colors"
                    )}
                  >
                    {rank < 10 ? `0${rank}` : rank}
                  </span>
                  
                  {/* Subtle rank icon/medal for top 3 */}
                  {rank === 1 && (
                    <Crown className="h-3.5 w-3.5 mt-1 text-[#D4AF37] drop-shadow-[0_0_4px_rgba(212,175,55,0.4)] animate-pulse" />
                  )}
                  {rank === 2 && (
                    <Trophy className="h-3 w-3 mt-1 text-[#A8A8A8] drop-shadow-[0_0_4px_rgba(168,168,168,0.3)]" />
                  )}
                  {rank === 3 && (
                    <Medal className="h-3 w-3 mt-1 text-[#C27D38] drop-shadow-[0_0_4px_rgba(194,125,56,0.3)]" />
                  )}
                </div>

                {/* 2. Avatar with dynamic outer ring */}
                <div className="relative shrink-0">
                  <div
                    className="h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-xl border bg-[#1A1A1E] transition-all duration-300 group-hover:scale-105"
                    style={{
                      borderColor: rank <= 3 ? (rank === 1 ? '#D4AF37' : rank === 2 ? '#A8A8A8' : '#C27D38') : 'rgba(255,255,255,0.08)',
                      boxShadow: rank <= 3 ? `0 0 12px ${rank === 1 ? 'rgba(212,175,55,0.35)' : rank === 2 ? 'rgba(168,168,168,0.2)' : 'rgba(194,125,56,0.2)'}` : undefined
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  {/* Small "You" dot indicator on avatar if it is the current user */}
                  {isMe && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-red ring-2 ring-[#0E0E10] text-[7px] font-black text-white">
                      TY
                    </span>
                  )}
                </div>

                {/* 3. Driver Name (Bigger!) */}
                <div className="min-w-0">
                  <span
                    className={clsx(
                      "truncate text-lg sm:text-xl font-extrabold tracking-tight leading-none block",
                      isMe ? "text-brand-red font-black" : "text-white group-hover:text-white/95"
                    )}
                  >
                    {u.name}
                  </span>
                </div>
              </div>

              {/* Right Side: Score Readout + Expand Arrow */}
              <div className="flex shrink-0 items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-black tracking-tighter tabular-nums text-white leading-none">
                    {scoreValue}
                  </div>
                  <div className="text-[9px] font-extrabold uppercase tracking-widest text-gray-500 mt-1">
                    {scoreLabel}
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center w-7 h-7 rounded-full bg-white/2 border border-white/4 text-gray-500 transition-all duration-300 group-hover:text-white group-hover:bg-white/8">
                  <ChevronDown
                    className={clsx(
                      "h-4 w-4 transition-transform duration-300",
                      isExpanded && "rotate-180 text-white"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Team and Favorite Driver (Below profile picture, name, and points) */}
            <div className="pl-11 sm:pl-14 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis mt-1">
              <span className="font-extrabold uppercase tracking-wider shrink-0" style={{ color: teamColor }}>
                {u.team}
              </span>
              {u.favoriteDriver && (
                <>
                  <span className="text-white/10 select-none font-light shrink-0">|</span>
                  <span className="flex items-center gap-1 text-gray-500 font-bold uppercase text-[9px] sm:text-[10px] tracking-wide truncate">
                    <User className="h-2.5 w-2.5 text-gray-600 shrink-0" />
                    <span className="truncate">{u.favoriteDriver.name}</span>
                  </span>
                </>
              )}
            </div>
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
            <div className="mt-2 rounded-2xl border border-white/4 bg-[#09090B]/90 backdrop-blur-md p-4 sm:p-5 pl-5 sm:pl-6 shadow-inner">
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  {
                    label: "Typy",
                    value: u.voteCount.toString(),
                    icon: <Zap className="h-4 w-4" />,
                    iconBg: "bg-brand-red/10 border-brand-red/20 text-brand-red",
                    glow: "hover:shadow-[0_0_12px_rgba(230,0,0,0.15)]"
                  },
                  {
                    label: "Idealne",
                    value: u.perfectPredictions.toString(),
                    icon: <Target className="h-4 w-4" />,
                    iconBg: "bg-green-500/10 border-green-500/20 text-green-400",
                    glow: "hover:shadow-[0_0_12px_rgba(74,222,128,0.15)]"
                  },
                  {
                    label: "Rundy",
                    value: u.racesScored.toString(),
                    icon: <Medal className="h-4 w-4" />,
                    iconBg: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
                    glow: "hover:shadow-[0_0_12px_rgba(250,204,21,0.15)]"
                  },
                  {
                    label: "Średnia",
                    value: avgPoints,
                    icon: <TrendingUp className="h-4 w-4" />,
                    iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                    glow: "hover:shadow-[0_0_12px_rgba(96,165,250,0.15)]"
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={clsx(
                      "flex flex-col items-center rounded-xl bg-white/2 border border-white/3 py-3.5 sm:py-4 transition-all duration-300 hover:bg-white/4 hover:border-white/10",
                      stat.glow
                    )}
                  >
                    <div className={clsx("mb-2 flex h-8 w-8 items-center justify-center rounded-lg border", stat.iconBg)}>
                      {stat.icon}
                    </div>
                    <div className="text-xl sm:text-2xl font-black tabular-nums text-white leading-none">
                      {stat.value}
                    </div>
                    <div className="mt-1.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-gray-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
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