"use client";

import { useEffect, useState, useRef } from "react";
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
  Star,
  AlertTriangle,
} from "lucide-react";

type PredictionDetail = {
  driverId: string;
  predictedPos: number;
  actualPos: number | null;
  inTop10?: boolean; // legacy, may still appear in old data
  selectionPoints?: number; // legacy
  positionPoints: number;
  points: number;
};

type ScoreDetails = {
  predictions: PredictionDetail[];
  bonusP1: number;
  bonusPodium: number;
  fromSeason?: boolean;
  extraPredictions?: {
    dotd: { predicted: string | null; actual: string | null; correct: boolean } | null;
    dnfCount: { predicted: number | null; actual: number | null; correct: boolean } | null;
    fastestLap: { predicted: string | null; actual: string | null; correct: boolean } | null;
    startCollision: { predicted: boolean | null; actual: boolean | null; correct: boolean } | null;
  } | null;
  extraDotd?: number;
  extraDnf?: number;
  extraFastestLap?: number;
  extraCollision?: number;
  extraAllBonus?: number;
  extraTotal?: number;
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
  isSprint?: boolean;
  hideHeader?: boolean;
};

export default function RaceResultsContent({ raceRound, isSprint = false, hideHeader = false }: Props) {
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
        const race = await getRaceWithResults(raceRound, isSprint);
        if (race && (isSprint ? race.sprintCompleted : race.completed)) {
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
  }, [raceRound, user, authLoading, router, isSprint]);

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

  const isDataCompleted = raceData ? (isSprint ? (raceData as any).sprintCompleted : raceData.completed) : false;

  if (!raceData || !isDataCompleted) {
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
  const maxPoints = isSprint ? 70 : 75;
  const scorePercent = myScore
    ? Math.round((myScore.totalPoints / maxPoints) * 100)
    : 0;

  const toggleSection = (id: string) => {
    // Save scroll position before toggling so the page doesn't jump
    const scrollY = window.scrollY;
    setExpandedSection(expandedSection === id ? null : id);
    // Restore scroll position on next frame
    requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "instant" }));
  };

  return (
    <div className="mx-auto max-w-lg px-3 sm:px-4 pb-28 pt-4 sm:pt-6">
      {/* ── HERO RACE HEADER ── */}
      {!hideHeader && (
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
      )}

      {/* ── WRAPPED BUTTON ── */}
      {myScore && (
        <button
          onClick={() => router.push(`/race/${raceRound}/results/wrapped${isSprint ? "?isSprint=true" : ""}`)}
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
                {/* Extra predictions badges */}
                {myDetails.extraTotal !== undefined && myDetails.extraTotal > 0 && (
                  <div className="flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 backdrop-blur-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-wider text-cyan-400/80">
                        Dodatkowe
                      </div>
                      <div className="text-sm font-black text-white">
                        +{myDetails.extraTotal} <span className="text-[10px] text-gray-500">PKT</span>
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
                        : pred.points > 0
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
                        {pred.actualPos ? (
                          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                            <div className="text-right">
                              <div
                                className={clsx(
                                  "rounded-lg px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-black inline-block",
                                  isPerfect
                                    ? "bg-[#E60000]/20 text-[#E60000]"
                                    : diff !== null && diff <= 2
                                      ? "bg-emerald-500/15 text-emerald-400"
                                      : "bg-white/[0.06] text-gray-400"
                                )}
                              >
                                {isSprint ? (pred.actualPos > 8 ? `P${pred.actualPos}` : `P${pred.actualPos}`) : `P${pred.actualPos}`}
                              </div>
                              <div className="mt-1 flex flex-wrap justify-end gap-1 sm:gap-1.5">
                                {pred.positionPoints > 0 && (
                                  <div className={clsx(
                                    "flex items-center gap-1 rounded-md border px-1.5 py-[2px] backdrop-blur-sm",
                                    diff === 0 ? "border-[#E60000]/20 bg-[#E60000]/10" :
                                    diff === 1 ? "border-orange-400/20 bg-orange-400/10" :
                                    diff === 2 ? "border-yellow-400/20 bg-yellow-400/10" :
                                    "border-gray-600/20 bg-gray-600/10"
                                  )}>
                                    <span className={clsx(
                                      "text-[8px] font-bold uppercase hidden sm:inline-block",
                                      diff === 0 ? "text-[#E60000]/70" :
                                      diff === 1 ? "text-orange-400/70" :
                                      diff === 2 ? "text-yellow-400/70" :
                                      "text-gray-600/70"
                                    )}>
                                      {isPerfect ? "Idealnie" : `±${diff}`}
                                    </span>
                                    <span className={clsx(
                                      "text-[9px] font-black",
                                      diff === 0 ? "text-[#E60000]" :
                                      diff === 1 ? "text-orange-400" :
                                      diff === 2 ? "text-yellow-400" :
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
                                  : pred.points >= 2
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
                              DNF
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

      {/* ── EXTRA PREDICTIONS ── */}
      {myDetails && myDetails.extraPredictions && !isSprint && (
        <CollapsibleSection
          id="extras"
          icon={Zap}
          title="Dodatkowe Typy"
          count={myDetails.extraTotal ?? 0}
          expanded={expandedSection === "extras"}
          onToggle={() => toggleSection("extras")}
        >
          <div className="space-y-2">
            {[
              {
                label: "Driver of the Day",
                icon: <Star className="h-4 w-4 text-yellow-400" />,
                data: myDetails.extraPredictions.dotd,
                points: myDetails.extraDotd ?? 0,
                format: (val: string | number | boolean | null) => {
                  if (!val) return "—";
                  const d = drivers.find(dr => dr.slug === val);
                  return d ? d.name : String(val);
                },
              },
              {
                label: "Liczba DNF",
                icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
                data: myDetails.extraPredictions.dnfCount,
                points: myDetails.extraDnf ?? 0,
                format: (val: string | number | boolean | null) => val !== null ? String(val) : "—",
              },
              {
                label: "Najszybsze okrążenie",
                icon: <CircleDot className="h-4 w-4 text-purple-400" />,
                data: myDetails.extraPredictions.fastestLap,
                points: myDetails.extraFastestLap ?? 0,
                format: (val: string | number | boolean | null) => {
                  if (!val) return "—";
                  const d = drivers.find(dr => dr.slug === val);
                  return d ? d.name : String(val);
                },
              },
              {
                label: "Kolizja na starcie",
                icon: <Flame className="h-4 w-4 text-amber-400" />,
                data: myDetails.extraPredictions.startCollision,
                points: myDetails.extraCollision ?? 0,
                format: (val: string | number | boolean | null) => val === true ? "Tak" : val === false ? "Nie" : "—",
              },
            ].map((item) => {
              const isCorrect = item.data?.correct ?? false;
              const predicted = item.data ? item.format(item.data.predicted) : "—";
              const actual = item.data ? item.format(item.data.actual) : "—";

              return (
                <div
                  key={item.label}
                  className={clsx(
                    "relative overflow-hidden rounded-2xl border p-3.5 sm:p-4 backdrop-blur-sm transition-all",
                    isCorrect
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-white/[0.06] bg-white/[0.02] opacity-70"
                  )}
                >
                  {isCorrect && (
                    <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500" />
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-white mb-0.5">{item.label}</div>
                      <div className="flex items-center gap-3 text-[11px]">
                        <div>
                          <span className="text-gray-500 mr-1">Twój typ:</span>
                          <span className="font-bold text-gray-300">{predicted}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 mr-1">Wynik:</span>
                          <span className="font-bold text-white">{actual}</span>
                        </div>
                      </div>
                    </div>
                    <div className={clsx(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm",
                      isCorrect
                        ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                        : "bg-white/[0.03] text-gray-700"
                    )}>
                      +{item.points}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* All correct bonus */}
            {(myDetails.extraAllBonus ?? 0) > 0 && (
              <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-3.5 sm:p-4">
                <div className="absolute inset-y-0 left-0 w-1 bg-cyan-500" />
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-white">Bonus — Wszystkie trafione!</div>
                    <div className="text-[10px] text-cyan-400/80 font-bold">Wszystkie 4 dodatkowe typy poprawne</div>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 font-black text-sm ring-1 ring-cyan-500/30">
                    +1
                  </div>
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* ── RESULTS — Podium Focus ── */}
      <CollapsibleSection
        id="classification"
        icon={Flag}
        title="Wyniki"
        count={(isSprint ? (raceData as any).sprintResults : raceData.results).length}
        expanded={expandedSection === "classification"}
        onToggle={() => toggleSection("classification")}
      >
        <div className="space-y-2">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#131315]">
            {(isSprint ? (raceData as any).sprintResults : raceData.results).map((driverId: string, pos: number) => {
              const driver = drivers.find((d) => d.slug === driverId);
              if (!driver) return null;

              return (
                <div
                  key={driverId}
                  className={clsx(
                    "flex flex-col gap-2 px-3.5 py-3 sm:px-4 border-b border-white/[0.05] last:border-0"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black",
                      pos === 0 ? "bg-gradient-to-br from-[#E60000] to-[#FF6B6B] shadow-lg shadow-[#E60000]/50 text-white" :
                      pos === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900" :
                      pos === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white" :
                      "bg-white/10 text-gray-300"
                    )}>
                      {pos + 1}
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

                  {/* How people voted */}
                  <DriverVotesGrouped driverId={driverId} actualPos={pos + 1} scores={raceData.scores} />
                </div>
              );
            })}
          </div>

          {/* Dodatkowe typowania – community summary */}
          {!isSprint && raceData.scores.some(s => s.details?.extraPredictions) && (
            <div className="mt-4 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1 mb-2 flex items-center gap-2">
                <Zap className="h-3 w-3" /> Dodatkowe Typowania
              </div>
              <ExtraPredictionsCommunity scores={raceData.scores} drivers={drivers} />
            </div>
          )}
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
                  Za każdego kierowcę (22 kierowców)
                </div>
                <div className="space-y-2">
                  {[
                    { l: "Idealnie (±0)", p: "+3", c: "text-[#E60000]" },
                    { l: "Różnica ±1", p: "+2", c: "text-orange-400" },
                    { l: "Różnica ±2", p: "+1", c: "text-yellow-400" },
                    { l: "Różnica ±3 i więcej", p: "+0", c: "text-gray-600" },
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
                    <span className="font-black text-[#E60000]">+1</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Całe podium</span>
                    <span className="font-black text-[#E60000]">+3</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#E60000]/[0.08] p-4">
                <span className="text-xs font-black uppercase text-white">
                  Maksimum {isSprint ? '(sprint)' : '(wyścig)'}
                </span>
                <span className="text-2xl font-black text-[#E60000]">
                  {isSprint ? '70' : '75'} pkt
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Extra predictions section (race only) */}
        {showScoringInfo && !isSprint && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#131315]">
            <div className="p-4">
              <div className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-500">
                Dodatkowe Typowanie (tylko wyścig)
              </div>
              <div className="space-y-2">
                {[
                  { l: "Driver of the Day", p: "+1", c: "text-yellow-400" },
                  { l: "Liczba DNF", p: "+1", c: "text-red-400" },
                  { l: "Najszybsze okrążenie", p: "+1", c: "text-purple-400" },
                  { l: "Kolizja na starcie", p: "+1", c: "text-amber-400" },
                  { l: "Wszystkie 4 trafione (bonus)", p: "+1", c: "text-cyan-400" },
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
            <div className="flex items-center justify-between bg-[#E60000]/[0.08] p-4">
              <span className="text-xs font-black uppercase text-white">
                Maks. Dodatkowe
              </span>
              <span className="text-2xl font-black text-cyan-400">
                5 pkt
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
}

/* ── EXTRA PREDICTIONS COMMUNITY ── */
function ExtraPredictionsCommunity({ scores, drivers }: { scores: RaceScore[], drivers: DriverInfo[] }) {
  type ExtraEntry = {
    user: RaceScore['user'];
    predicted: string;
    correct: boolean;
  };

  // Collect actual values from any score that has extra predictions
  const anyExtra = scores.find(s => s.details?.extraPredictions)?.details?.extraPredictions;
  if (!anyExtra) return null;

  const formatDriver = (slug: string | null | undefined) => {
    if (!slug) return "—";
    const d = drivers.find(dr => dr.slug === slug);
    return d ? d.name.split(" ").pop()! : slug;
  };

  const categories: {
    key: keyof NonNullable<ScoreDetails['extraPredictions']>;
    label: string;
    emoji: string;
    actual: string;
    format: (val: string | number | boolean | null | undefined) => string;
  }[] = [
    {
      key: "dotd",
      label: "Driver of the Day",
      emoji: "⭐",
      actual: formatDriver(anyExtra.dotd?.actual ?? null),
      format: (v) => formatDriver(v as string | null),
    },
    {
      key: "dnfCount",
      label: "Liczba DNF",
      emoji: "💥",
      actual: anyExtra.dnfCount?.actual != null ? String(anyExtra.dnfCount.actual) : "—",
      format: (v) => v != null ? String(v) : "—",
    },
    {
      key: "fastestLap",
      label: "Najszybsze okrążenie",
      emoji: "⏱",
      actual: formatDriver(anyExtra.fastestLap?.actual ?? null),
      format: (v) => formatDriver(v as string | null),
    },
    {
      key: "startCollision",
      label: "Kolizja na starcie",
      emoji: "💢",
      actual: anyExtra.startCollision?.actual != null ? (anyExtra.startCollision.actual ? "Tak" : "Nie") : "—",
      format: (v) => v === true ? "Tak" : v === false ? "Nie" : "—",
    },
  ];

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const entries: ExtraEntry[] = scores.flatMap(score => {
          const extra = score.details?.extraPredictions;
          if (!extra) return [];
          const field = extra[cat.key];
          if (!field) return [];
          const predicted = cat.format((field as any).predicted);
          if (predicted === "—") return [];
          return [{ user: score.user, predicted, correct: (field as any).correct }];
        });

        if (entries.length === 0) return null;

        // Group by predicted value
        const grouped: Record<string, { predicted: string; correct: boolean; users: RaceScore['user'][] }> = {};
        for (const e of entries) {
          if (!grouped[e.predicted]) {
            grouped[e.predicted] = { predicted: e.predicted, correct: e.correct, users: [] };
          }
          grouped[e.predicted].users.push(e.user);
        }

        const sortedGroups = Object.values(grouped).sort((a, b) => {
          if (a.correct && !b.correct) return -1;
          if (!a.correct && b.correct) return 1;
          return b.users.length - a.users.length;
        });

        return (
          <div key={cat.key} className="rounded-2xl border border-white/[0.06] bg-[#131315] overflow-hidden">
            {/* Category header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05]">
              <span className="text-base">{cat.emoji}</span>
              <span className="text-xs font-black uppercase tracking-wider text-gray-300 flex-1">{cat.label}</span>
              <span className="text-[10px] font-bold text-gray-500">
                Wynik: <span className="text-white font-black">{cat.actual}</span>
              </span>
            </div>

            {/* Votes grouped by answer */}
            <div className="p-3 space-y-2">
              {sortedGroups.map((group) => (
                <div
                  key={group.predicted}
                  className={clsx(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 border",
                    group.correct
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : "border-white/[0.04] bg-white/[0.02]"
                  )}
                >
                  {/* Answer */}
                  <div className={clsx(
                    "shrink-0 text-xs font-black min-w-[3rem] text-center",
                    group.correct ? "text-emerald-400" : "text-gray-400"
                  )}>
                    {group.predicted}
                  </div>

                  {/* Avatars */}
                  <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                    {group.users.map((u) => (
                      <img
                        key={u.id}
                        src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=E60000&color=fff&bold=true`}
                        alt={u.name || "User"}
                        title={u.name || "User"}
                        className={clsx(
                          "h-8 w-8 rounded-full object-cover border-2 shadow-sm transition-transform hover:scale-110",
                          group.correct ? "border-emerald-500/50" : "border-white/10"
                        )}
                      />
                    ))}
                  </div>

                  {/* Correct badge */}
                  {group.correct && (
                    <div className="shrink-0 rounded-lg bg-emerald-500/20 px-2 py-1 text-xs font-black text-emerald-400">
                      +1
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── DRIVER VOTES COMPONENT ── */
function DriverVotesGrouped({ driverId, actualPos, scores }: { driverId: string, actualPos: number, scores: RaceScore[] }) {
  // Gather all predictions for this driver from all users that have details
  const predictions = scores.flatMap(score => {
    if (!score.details?.predictions) return [];
    const prediction = score.details.predictions.find(p => p.driverId === driverId);
    if (!prediction) return [];
    const diff = Math.abs(prediction.predictedPos - actualPos);
    const pts = diff === 0 ? 3 : diff === 1 ? 2 : diff === 2 ? 1 : 0;
    return [{ user: score.user, predictedPos: prediction.predictedPos, diff, pts }];
  });

  if (predictions.length === 0) return null;

  // Group by predicted position for pts > 0; lump all 0-pt together
  type Group = { key: string, pos: number | null, pts: number, diff: number, entries: { user: RaceScore['user'], predictedPos: number }[] };
  const grouped: Record<string, Group> = {};

  for (const p of predictions) {
    const key = p.pts > 0 ? String(p.predictedPos) : '0pts';
    if (!grouped[key]) {
      grouped[key] = { key, pos: p.pts > 0 ? p.predictedPos : null, pts: p.pts, diff: p.diff, entries: [] };
    }
    grouped[key].entries.push({ user: p.user, predictedPos: p.predictedPos });
  }

  const sortedGroups = Object.values(grouped).sort((a, b) => {
    if (a.pts !== b.pts) return b.pts - a.pts;
    return (a.pos ?? 99) - (b.pos ?? 99);
  });

  return (
    <div className="mt-2.5 flex flex-col gap-2 w-full">
      {sortedGroups.map((group) => (
        <div key={group.key} className={clsx("flex items-center gap-3 rounded-xl px-3 py-2 border",
          group.pts === 3 ? "border-[#E60000]/30 bg-[#E60000]/10" :
          group.pts === 2 ? "border-orange-400/20 bg-orange-400/10" :
          group.pts === 1 ? "border-amber-500/20 bg-amber-500/10" :
          "border-white/[0.05] bg-white/[0.02]"
        )}>
          {/* Position label */}
          <div className={clsx("text-xs font-black shrink-0 text-center min-w-[2rem]",
            group.pts === 3 ? "text-[#E60000]" :
            group.pts === 2 ? "text-orange-400" :
            group.pts === 1 ? "text-amber-500" :
            "text-gray-500"
          )}>
            {group.pos != null ? `P${group.pos}` : "inne"}
          </div>

          {/* Avatars */}
          <div className="flex flex-wrap gap-2 flex-1 min-w-0">
            {group.entries.map((e) => (
              group.pts === 0 ? (
                <div key={e.user.id} className="flex flex-col items-center gap-0.5">
                  <img
                    src={e.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(e.user.name || "U")}&background=444&color=fff&bold=true`}
                    alt={e.user.name || "User"}
                    title={`${e.user.name || "User"} → P${e.predictedPos}`}
                    className="h-8 w-8 rounded-full object-cover border-2 border-white/10 shadow-sm"
                  />
                  <span className="text-[9px] font-black text-gray-500">P{e.predictedPos}</span>
                </div>
              ) : (
                <img
                  key={e.user.id}
                  src={e.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(e.user.name || "U")}&background=E60000&color=fff&bold=true`}
                  alt={e.user.name || "User"}
                  title={`${e.user.name || "User"} → P${e.predictedPos}`}
                  className={clsx("h-8 w-8 rounded-full object-cover border-2 shadow-sm transition-transform hover:scale-110",
                    group.pts === 3 ? "border-[#E60000]/50" :
                    group.pts === 2 ? "border-orange-400/50" :
                    "border-amber-500/50"
                  )}
                />
              )
            ))}
          </div>

          {/* Points badge */}
          <div className={clsx("shrink-0 rounded-lg px-2 py-1 text-xs font-black",
            group.pts === 3 ? "bg-[#E60000]/20 text-[#E60000]" :
            group.pts === 2 ? "bg-orange-400/20 text-orange-400" :
            group.pts === 1 ? "bg-amber-500/20 text-amber-500" :
            "bg-white/[0.04] text-gray-600"
          )}>
            +{group.pts}
          </div>
        </div>
      ))}
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