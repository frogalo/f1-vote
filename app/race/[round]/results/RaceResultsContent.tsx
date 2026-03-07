"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { getTeamLogo } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  getRaceWithResults,
  getActiveDriversForResults,
} from "@/app/actions/raceResults";
import {
  Info,
  ChevronDown,
  Trophy,
  Target,
  Flag,
  Crown,
  Zap,
  TrendingUp,
  Award,
  CircleDot,
  Hash,
  Sparkles,
  Flame,
  Bolt,
  Medal,
} from "lucide-react";

type PredictionDetail = {
  driverId: string;
  predictedPos: number;
  actualPos: number | null;
  inTop10: boolean;
  selectionPoints: number;
  positionPoints: number;
  points: number;
};

type ScoreDetails = {
  predictions: PredictionDetail[];
  bonusP1: number;
  bonusPodium: number;
  fromSeason?: boolean;
};

type RaceScore = {
  userId: string;
  totalPoints: number;
  perfectPredictions: number;
  details: ScoreDetails | null;
  user: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
};

type RaceResult = {
  round: number;
  name: string;
  location: string;
  completed: boolean;
  results: string[];
  scores: RaceScore[];
};

type DriverInfo = {
  slug: string;
  name: string;
  number: number;
  team: string;
  color: string;
  country: string;
};

type Props = {
  raceRound: number;
};

export default function RaceResultsContent({ raceRound }: Props) {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [raceData, setRaceData] = useState<RaceResult | null>(null);
  const [drivers, setDrivers] = useState<DriverInfo[]>([]);
  const [showScoringInfo, setShowScoringInfo] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "predictions"
  );
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user?.isAdmin) {
      router.push("/admin");
      return;
    }

    async function loadData() {
      try {
        const race = await getRaceWithResults(raceRound);
        if (race && race.completed) {
          setRaceData(race as unknown as RaceResult);
        }
        const driversData = await getActiveDriversForResults();
        setDrivers(driversData);
      } catch (err) {
        console.error("Error loading race results:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [raceRound, user, authLoading, router]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0D0D0D]">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#E60000]/20 border-t-[#E60000]" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border border-[#E60000]/10" />
        </div>
        <div className="mt-6 animate-pulse text-sm font-bold uppercase tracking-[0.3em] text-[#E60000]/80">
          Ładowanie wyników
        </div>
      </div>
    );
  }

  if (!raceData || !raceData.completed) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/5 bg-[#1C1C1E]">
          <Flag className="h-8 w-8 text-gray-600" />
        </div>
        <p className="mb-1 text-lg font-bold text-white">Brak wyników</p>
        <p className="mb-6 text-sm text-gray-500">
          Wyścig w toku lub wyniki są niedostępne.
        </p>
        <button
          onClick={() => router.push("/calendar")}
          className="group relative overflow-hidden rounded-xl bg-[#E60000] px-8 py-3.5 font-bold text-white shadow-lg shadow-red-900/30 transition-all active:scale-95"
        >
          <span className="relative z-10">Wróć do terminarza</span>
          <div className="absolute inset-0 -translate-x-full bg-white/10 transition-transform group-hover:translate-x-0" />
        </button>
      </div>
    );
  }

  const myScore = raceData.scores.find((s) => s.user.id === user?.id);
  const myDetails = myScore?.details as ScoreDetails | null;
  const scorePercent = myScore
    ? Math.round((myScore.totalPoints / 78) * 100)
    : 0;

  const toggleSection = (id: string) =>
    setExpandedSection(expandedSection === id ? null : id);

  return (
    <div className="mx-auto max-w-lg px-3 sm:px-4 pb-28 pt-4 sm:pt-6">
      {/* ── HERO RACE HEADER ── */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.08]">
        {/* Dynamic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1D] via-[#131315] to-[#0D0D0D]" />
        <div className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#E60000]/20 blur-[80px]" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[#E60000]/10 blur-[70px]" />

        {/* Top accent bar */}
        <div className="relative h-1.5 bg-gradient-to-r from-[#E60000] via-[#FF6B6B] to-transparent" />

        <div className="relative z-10 p-6 sm:p-8">
          {/* Round badge with animation */}
          <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-[#E60000]/30 bg-[#E60000]/5 px-3.5 py-1.5 backdrop-blur-sm">
            <div className="relative h-2.5 w-2.5">
              <div className="absolute inset-0 animate-pulse rounded-full bg-[#E60000]" />
              <div className="absolute inset-1 rounded-full bg-[#E60000] opacity-40" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#E60000]">
              Runda {raceData.round}
            </span>
          </div>

          {/* Main heading with dynamic layout */}
          <div className="mb-4">
            <h1 className="text-4xl sm:text-5xl font-black uppercase leading-[0.95] tracking-tighter text-white">
              {raceData.name.replace(" Grand Prix", "")}
              <span className="block bg-gradient-to-r from-[#E60000] to-[#FF6B6B] bg-clip-text text-transparent">
                Grand Prix
              </span>
            </h1>
          </div>

          {/* Location with icon */}
          <div className="flex items-center gap-2 text-gray-400">
            <div className="h-1 w-1 rounded-full bg-[#E60000]" />
            <span className="text-sm font-bold uppercase tracking-[0.15em]">
              {raceData.location}
            </span>
          </div>
        </div>
      </div>

      {/* ── WRAPPED BUTTON ── */}
      {myScore && (
        <button
          onClick={() => router.push(`/race/${raceRound}/results/wrapped`)}
          className="group relative mb-8 w-full overflow-hidden rounded-3xl border border-[#E60000]/30 p-[1px] transition-all active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#E60000] via-[#FF6B6B] to-[#E60000] opacity-30 transition-opacity group-hover:opacity-50" />
          <div className="relative flex items-center gap-4 rounded-3xl bg-gradient-to-r from-[#1a0000] via-[#151517] to-[#1a0000] px-5 py-4 sm:px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E60000]/20 backdrop-blur-md">
              <Sparkles className="h-6 w-6 text-[#E60000]" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#E60000]">
                Podsumowanie Rundy
              </div>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E60000]/20 group-hover:bg-[#E60000]/40 transition-colors">
              <span className="text-[#E60000] text-lg">→</span>
            </div>
          </div>
        </button>
      )}

      {/* ── MY SCORE — HERO CARD ── */}
      {myScore && (
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#E60000]/20">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#E60000]/10 via-[#151517] to-[#131315]" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#E60000]/15 blur-[60px]" />

          {/* Top bar */}
          <div className="relative h-1.5 bg-gradient-to-r from-[#E60000] via-[#FF6B6B]/60 to-transparent" />

          <div className="relative z-10 space-y-6 p-6 sm:p-8">
            {/* Header with stats */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#E60000] text-xs font-black text-white">
                    ★
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-[#E60000]">
                    Twój Wynik
                  </span>
                </div>
              </div>
              {/* {myScore.perfectPredictions > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs font-black text-emerald-400">
                    {myScore.perfectPredictions} Idealnie
                  </span>
                </div>
              )} */}
            </div>

            {/* Score display */}
            <div className="space-y-3">
              <div className="flex items-end gap-4">
                <div>
                  <div className="text-6xl sm:text-7xl font-black tabular-nums text-white leading-none">
                    {myScore.totalPoints}
                  </div>
                </div>
              </div>
            </div>

            {/* Bonus badges */}
            {myDetails && (
              <div className="flex flex-wrap gap-2 pt-2">
                {myScore && myScore.perfectPredictions > 0 && (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 backdrop-blur-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-wider text-emerald-400/80">
                        Idealnie
                      </div>
                      <div className="text-sm font-black text-emerald-400">
                        {myScore.perfectPredictions}
                      </div>
                    </div>
                  </div>
                )}
                {myDetails.bonusP1 > 0 && (
                  <div className="flex items-center gap-3 rounded-xl border border-[#E60000]/30 bg-[#E60000]/10 px-3 py-2 backdrop-blur-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E60000]/20 text-[#E60000]">
                      <Flame className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-wider text-[#E60000]/80">
                        Zwycięzca
                      </div>
                      <div className="text-sm font-black text-white">
                        +{myDetails.bonusP1} <span className="text-[10px] text-gray-500">PKT</span>
                      </div>
                    </div>
                  </div>
                )}
                {myDetails.bonusPodium > 0 && (
                  <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 backdrop-blur-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                      <Medal className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-wider text-amber-500/80">
                        Całe Podium
                      </div>
                      <div className="text-sm font-black text-white">
                        +{myDetails.bonusPodium} <span className="text-[10px] text-gray-500">PKT</span>
                      </div>
                    </div>
                  </div>
                )}
                {myDetails.fromSeason && (
                  <div className="flex items-center gap-3 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 backdrop-blur-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                      <Bolt className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-wider text-purple-400/80">
                        Auto uzupełnienie
                      </div>
                      <div className="text-sm font-black text-purple-400">
                        Typy z Sezonu
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PREDICTIONS GRID ── */}
      {myDetails && myDetails.predictions.length > 0 && (
        <CollapsibleSection
          id="predictions"
          icon={Target}
          title="Twoje Typy"
          count={myDetails.predictions.length}
          expanded={expandedSection === "predictions"}
          onToggle={() => toggleSection("predictions")}
        >
          <div className="space-y-2 sm:space-y-2.5">
            {myDetails.predictions
              .sort((a, b) => a.predictedPos - b.predictedPos)
              .map((pred) => {
                const driver = drivers.find(
                  (d) => d.slug === pred.driverId
                );
                if (!driver) return null;

                const isPerfect =
                  pred.actualPos === pred.predictedPos;
                const diff = pred.actualPos
                  ? Math.abs(pred.predictedPos - pred.actualPos)
                  : null;

                return (
                  <div
                    key={pred.driverId}
                    className={clsx(
                      "group relative overflow-hidden rounded-2xl border p-3.5 sm:p-4 backdrop-blur-sm transition-all duration-300",
                      isPerfect
                        ? "border-[#E60000]/40 bg-gradient-to-r from-[#E60000]/15 to-transparent shadow-lg shadow-[#E60000]/10"
                        : pred.inTop10
                          ? "border-emerald-500/20 bg-emerald-500/5"
                          : "border-white/[0.06] bg-white/[0.02] opacity-60"
                    )}
                  >
                    {/* Left accent */}
                    {isPerfect && (
                      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#E60000] to-[#FF6B6B]" />
                    )}

                    {/* Position badge & Container */}
                    <div className="flex items-center gap-3 sm:gap-4 w-full">
                      <div
                        className={clsx(
                          "flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl font-black text-sm",
                          pred.predictedPos === 1
                            ? "bg-[#E60000] text-white shadow-lg shadow-[#E60000]/40"
                            : pred.predictedPos <= 3
                              ? "bg-white/10 text-white"
                              : "bg-white/[0.06] text-gray-400"
                        )}
                      >
                        P{pred.predictedPos}
                      </div>

                      <div className="min-w-0 flex-1 flex items-center justify-between gap-3">
                        {/* Driver & Team Info */}
                        <div className="flex flex-col justify-center min-w-0 py-1">
                          <div className="font-black text-sm sm:text-[15px] text-white truncate leading-none">
                            {driver.name}
                          </div>
                          
                          <div className="mt-1.5 flex items-center gap-1.5 sm:gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getTeamLogo(driver.team)}
                              alt=""
                              className="h-3 w-3 sm:h-3.5 sm:w-3.5 object-contain opacity-50 invert brightness-0"
                            />
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-500 truncate">
                              {driver.team}
                            </span>
                          </div>
                        </div>

                        {/* Result section */}
                        {pred.inTop10 && pred.actualPos ? (
                          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                            <div className="text-right">
                              <div
                                className={clsx(
                                  "rounded-lg px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-black inline-block",
                                  isPerfect
                                    ? "bg-[#E60000]/20 text-[#E60000]"
                                    : diff && diff <= 2
                                      ? "bg-emerald-500/15 text-emerald-400"
                                      : "bg-white/[0.06] text-gray-400"
                                )}
                              >
                                P{pred.actualPos}
                              </div>
                              <div className="mt-1 flex flex-wrap justify-end gap-1 sm:gap-1.5">
                                {pred.selectionPoints > 0 && (
                                  <div className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-[2px] backdrop-blur-sm">
                                    <span className="text-[8px] font-bold uppercase text-emerald-500/70 hidden sm:inline-block">Top 10</span>
                                    <span className="text-[9px] font-black text-emerald-400">+{pred.selectionPoints}</span>
                                  </div>
                                )}
                                {pred.positionPoints > 0 && (
                                  <div className={clsx(
                                    "flex items-center gap-1 rounded-md border px-1.5 py-[2px] backdrop-blur-sm",
                                    diff === 0 ? "border-[#E60000]/20 bg-[#E60000]/10" :
                                    diff === 1 ? "border-orange-400/20 bg-orange-400/10" :
                                    diff === 2 ? "border-yellow-400/20 bg-yellow-400/10" :
                                    diff === 3 ? "border-blue-400/20 bg-blue-400/10" :
                                    diff === 4 ? "border-gray-400/20 bg-gray-400/10" :
                                    "border-gray-600/20 bg-gray-600/10"
                                  )}>
                                    <span className={clsx(
                                      "text-[8px] font-bold uppercase hidden sm:inline-block",
                                      diff === 0 ? "text-[#E60000]/70" :
                                      diff === 1 ? "text-orange-400/70" :
                                      diff === 2 ? "text-yellow-400/70" :
                                      diff === 3 ? "text-blue-400/70" :
                                      diff === 4 ? "text-gray-400/70" :
                                      "text-gray-600/70"
                                    )}>
                                      {isPerfect ? "Idealnie" : "Pozycja"}
                                    </span>
                                    <span className={clsx(
                                      "text-[9px] font-black",
                                      diff === 0 ? "text-[#E60000]" :
                                      diff === 1 ? "text-orange-400" :
                                      diff === 2 ? "text-yellow-400" :
                                      diff === 3 ? "text-blue-400" :
                                      diff === 4 ? "text-gray-400" :
                                      "text-gray-600"
                                    )}>+{pred.positionPoints}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Points circle */}
                            <div
                              className={clsx(
                                "flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl font-black text-xs sm:text-sm",
                                isPerfect
                                  ? "bg-[#E60000] text-white shadow-lg shadow-[#E60000]/40"
                                  : pred.points >= 4
                                    ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                                    : pred.points > 0
                                      ? "bg-white/[0.06] text-emerald-400/80"
                                      : "bg-white/[0.03] text-gray-700"
                              )}
                            >
                              +{pred.points}
                            </div>
                          </div>
                        ) : (
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-[9px] font-bold uppercase text-gray-600 hidden sm:inline-block">
                              Poza 10
                            </span>
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/[0.03] font-black text-xs sm:text-sm text-gray-700">
                              +0
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CollapsibleSection>
      )}

      {/* ── RESULTS — Podium Focus ── */}
      <CollapsibleSection
        id="classification"
        icon={Flag}
        title="Wyniki"
        count={10}
        expanded={expandedSection === "classification"}
        onToggle={() => toggleSection("classification")}
      >
        <div className="space-y-2">
          {/* Podium (1-3) */}
          <div className="mb-4 grid grid-cols-3 gap-2 items-end">
            {raceData.results.slice(0, 3).map((driverId, pos) => {
              const driver = drivers.find((d) => d.slug === driverId);
              if (!driver) return null;

              const podiumClass = [
                "order-2 z-10",
                "order-1 opacity-90",
                "order-3 opacity-90",
              ];

              return (
                <div
                  key={driverId}
                  className={clsx("flex flex-col items-center transition-transform hover:scale-105", podiumClass[pos])}
                >
                  {/* Card */}
                  <div
                    className={clsx(
                      "w-full overflow-hidden rounded-xl border relative bg-[#131315] flex flex-col items-center p-3 text-center",
                      pos === 0
                        ? "border-[#E60000]/40 shadow-[0_0_20px_rgba(230,0,0,0.15)] pt-5 pb-4"
                        : pos === 1
                          ? "border-gray-400/30 pt-4 pb-3"
                          : "border-orange-500/30 pt-4 pb-3"
                    )}
                  >
                    {/* Position Highlight */}
                    <div
                      className={clsx(
                        "absolute top-0 inset-x-0 h-1",
                        pos === 0
                          ? "bg-gradient-to-r from-[#E60000] to-[#FF6B6B]"
                          : pos === 1
                            ? "bg-gradient-to-r from-gray-300 to-gray-500"
                            : "bg-gradient-to-r from-orange-400 to-orange-600"
                      )}
                    />
                    
                    {/* Medal */}
                    <div
                      className={clsx(
                        "mb-3 flex items-center justify-center rounded-lg font-black",
                        pos === 0
                          ? "h-12 w-12 text-2xl bg-gradient-to-br from-[#E60000] to-[#FF6B6B] shadow-lg shadow-[#E60000]/50 text-white"
                          : pos === 1
                            ? "h-10 w-10 text-xl bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900"
                            : "h-10 w-10 text-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                      )}
                    >
                      {pos + 1}
                    </div>

                    {/* Logo instead of placeholder */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getTeamLogo(driver.team)}
                      alt=""
                      className="mb-2 h-8 w-8 object-contain opacity-80 invert brightness-0"
                    />

                    {/* Driver Name */}
                    <div className={clsx(
                      "font-black tracking-tight",
                      pos === 0 ? "text-base text-white" : "text-sm text-gray-200"
                    )}>
                      {driver.name.split(" ").pop()}
                    </div>
                    <div className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                      {driver.team}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4-10 in list */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#131315]">
            {raceData.results.slice(3, 10).map((driverId, pos) => {
              const driver = drivers.find((d) => d.slug === driverId);
              if (!driver) return null;

              return (
                <div
                  key={driverId}
                  className={clsx(
                    "flex items-center gap-3 px-3.5 py-3 sm:px-4 border-b border-white/[0.05] last:border-0"
                  )}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-black text-gray-300">
                    {pos + 4}
                  </div>

                  {/* Color dot */}
                  <div
                    className="h-5 w-1 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        driver.color.split(" ")[0] || "#666",
                    }}
                  />

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-black text-white truncate">
                      {driver.name}
                    </div>
                    <div className="text-[9px] text-gray-500">
                      {driver.team} • #{driver.number}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CollapsibleSection>

      {/* ── LEADERBOARD ── */}
      {raceData.scores.length > 0 && (
        <CollapsibleSection
          id="ranking"
          icon={Trophy}
          title="Ranking Rundy"
          count={raceData.scores.length}
          expanded={expandedSection === "ranking"}
          onToggle={() => toggleSection("ranking")}
        >
          <div className="space-y-2">
            {raceData.scores.map((score, index) => {
              const isMe = score.user.id === user?.id;
              const details = score.details as ScoreDetails | null;

              return (
                <div
                  key={score.userId}
                  className={clsx(
                    "group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3.5 sm:p-4 backdrop-blur-sm transition-all",
                    isMe
                      ? "border-[#E60000]/30 bg-gradient-to-r from-[#E60000]/15 to-transparent"
                      : index === 0
                        ? "border-amber-500/20 bg-amber-500/5"
                        : "border-white/[0.06] bg-white/[0.02]"
                  )}
                >
                  {/* Left bar */}
                  {isMe && (
                    <div className="absolute inset-y-0 left-0 w-1 bg-[#E60000]" />
                  )}

                  {/* Rank badge */}
                  <div
                    className={clsx(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-black text-sm",
                      index === 0
                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-gray-900"
                        : index === 1
                          ? "bg-gray-400 text-gray-900"
                          : index === 2
                            ? "bg-orange-600 text-white"
                            : "bg-white/10 text-gray-300"
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* Avatar */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      score.user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(score.user.name || "U")}&background=E60000&color=fff&bold=true`
                    }
                    alt={score.user.name || "User"}
                    className={clsx(
                      "h-10 w-10 shrink-0 rounded-lg object-cover border-2",
                      isMe
                        ? "border-[#E60000]/60"
                        : index === 0
                          ? "border-amber-500/60"
                          : "border-white/[0.1]"
                    )}
                  />

                  {/* User info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white truncate">
                        {score.user.name || "Anonim"}
                      </span>
                      {isMe && (
                        <span className="shrink-0 rounded bg-[#E60000] px-2 py-0.5 text-[8px] font-black text-white">
                          TY
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-2xl font-black text-white">
                      {score.totalPoints}
                    </span>
                    <span className="text-[8px] font-bold uppercase text-gray-500">
                      pkt
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* ── SCORING RULES ── */}
      <div className="mt-8">
        <button
          onClick={() => setShowScoringInfo(!showScoringInfo)}
          className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-gray-500" />
            <span className="flex-1 text-sm font-black uppercase tracking-wide text-gray-400">
              Zasady Punktowania
            </span>
            <ChevronDown
              className={clsx(
                "h-5 w-5 text-gray-500 transition-transform",
                showScoringInfo && "rotate-180"
              )}
            />
          </div>
        </button>

        {showScoringInfo && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#131315]">
            <div className="divide-y divide-white/[0.04]">
              <div className="p-4">
                <div className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-500">
                  Za każdego kierowcę w TOP 10
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    Obecność w TOP 10
                  </span>
                  <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 font-black text-emerald-400">
                    +1
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-500">
                  Bonus za pozycję
                </div>
                <div className="space-y-2">
                  {[
                    { l: "Idealnie (±0)", p: "+6", c: "text-[#E60000]" },
                    { l: "Różnica ±1", p: "+4", c: "text-orange-400" },
                    { l: "Różnica ±2", p: "+3", c: "text-yellow-400" },
                    { l: "Różnica ±3", p: "+2", c: "text-blue-400" },
                    { l: "Różnica ±4", p: "+1", c: "text-gray-400" },
                    { l: "Różnica ≥5", p: "+0", c: "text-gray-600" },
                  ].map((r) => (
                    <div
                      key={r.l}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-gray-400">{r.l}</span>
                      <span className={clsx("font-black", r.c)}>
                        {r.p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-500">
                  Bonusy
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Trafione P1</span>
                    <span className="font-black text-[#E60000]">+3</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Całe podium</span>
                    <span className="font-black text-[#E60000]">+5</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#E60000]/[0.08] p-4">
                <span className="text-xs font-black uppercase text-white">
                  Maksimum
                </span>
                <span className="text-2xl font-black text-[#E60000]">
                  78 pkt
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
}

/* ── COLLAPSIBLE SECTION ── */
function CollapsibleSection({
  id,
  icon: Icon,
  title,
  count,
  expanded,
  onToggle,
  children,
}: {
  id: string;
  icon: React.ComponentType<{ className: string }>;
  title: string;
  count?: number;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className={clsx(
          "w-full rounded-2xl border p-3.5 sm:p-4 text-left transition-all",
          expanded
            ? "border-white/[0.1] bg-[#1C1C1F]"
            : "border-white/[0.04] bg-[#131315] hover:bg-[#1A1A1D]"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              expanded
                ? "bg-[#E60000] text-white"
                : "bg-white/[0.08] text-gray-400"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <span className="flex-1 text-xs font-black uppercase tracking-wider text-gray-300">
            {title}
          </span>
          {count !== undefined && (
            <span className="rounded-lg bg-white/[0.08] px-2.5 py-1 text-[10px] font-black text-gray-500">
              {count}
            </span>
          )}
          <ChevronDown
            className={clsx(
              "h-4 w-4 text-gray-500 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {expanded && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
}