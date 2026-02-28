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
import { Info, ChevronDown, Trophy, Target, Flag, Crown } from "lucide-react";

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

  const toggleSection = (id: string) =>
    setExpandedSection(expandedSection === id ? null : id);

  return (
    <div className="mx-auto max-w-lg px-4 pb-28 pt-6">
      {/* ── RACE HEADER ── */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-[#1C1C1E] to-[#141416] p-6">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#E60000]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#E60000]/5 blur-2xl" />

        <div className="relative text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E60000]/20 bg-[#E60000]/10 px-4 py-1.5">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E60000]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E60000]">
              Runda {raceData.round} — Zakończona
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-black uppercase leading-none tracking-tight text-white">
            {raceData.name}
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            {raceData.location}
          </p>
        </div>
      </div>

      {/* ── SCORING SYSTEM INFO ── */}
      <div className="mb-6">
        <button
          onClick={() => setShowScoringInfo(!showScoringInfo)}
          className="group flex w-full items-center justify-between rounded-2xl border border-white/[0.06] bg-[#1C1C1E] p-4 text-left transition-all hover:border-white/10 hover:bg-[#222225]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E60000]/10">
              <Info className="h-4 w-4 text-[#E60000]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
              Zasady punktowania
            </span>
          </div>
          <ChevronDown
            className={clsx(
              "h-4 w-4 text-gray-500 transition-transform duration-300",
              showScoringInfo && "rotate-180"
            )}
          />
        </button>

        <div
          className={clsx(
            "grid transition-all duration-300 ease-in-out",
            showScoringInfo
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="mt-2 space-y-3 rounded-2xl border border-white/[0.06] bg-[#1C1C1E] p-5">
              {/* Selection */}
              <div className="rounded-xl bg-[#0D0D0D] p-3">
                <h3 className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Za każdego kierowcę w TOP 10
                </h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Obecność w TOP 10</span>
                  <span className="rounded-md bg-green-500/10 px-2 py-0.5 font-black text-green-400">
                    +1
                  </span>
                </div>
              </div>

              {/* Position bonus */}
              <div className="rounded-xl bg-[#0D0D0D] p-3">
                <h3 className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  🎯 Bonus za zgodność pozycji
                </h3>
                <div className="space-y-1.5">
                  {[
                    {
                      label: "Idealnie (±0)",
                      pts: "+6",
                      color: "text-[#E60000] bg-[#E60000]/10",
                    },
                    {
                      label: "Różnica ±1",
                      pts: "+4",
                      color: "text-orange-400 bg-orange-400/10",
                    },
                    {
                      label: "Różnica ±2",
                      pts: "+3",
                      color: "text-yellow-400 bg-yellow-400/10",
                    },
                    {
                      label: "Różnica ±3",
                      pts: "+2",
                      color: "text-blue-400 bg-blue-400/10",
                    },
                    {
                      label: "Różnica ±4",
                      pts: "+1",
                      color: "text-gray-400 bg-gray-400/10",
                    },
                    {
                      label: "Różnica ≥5",
                      pts: "+0",
                      color: "text-gray-600 bg-gray-600/10",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-gray-400">{row.label}</span>
                      <span
                        className={clsx(
                          "rounded-md px-2 py-0.5 font-black",
                          row.color
                        )}
                      >
                        {row.pts}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 border-t border-white/5 pt-2 text-[10px] text-gray-500">
                  Maks za kierowcę:{" "}
                  <span className="font-bold text-white">7 pkt</span>
                </div>
              </div>

              {/* Bonuses */}
              <div className="rounded-xl bg-[#0D0D0D] p-3">
                <h3 className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  ⭐ Bonusy
                </h3>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Trafione P1</span>
                    <span className="rounded-md bg-[#E60000]/10 px-2 py-0.5 font-black text-[#E60000]">
                      +3
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Całe podium</span>
                    <span className="rounded-md bg-[#E60000]/10 px-2 py-0.5 font-black text-[#E60000]">
                      +5
                    </span>
                  </div>
                </div>
              </div>

              {/* Max total */}
              <div className="flex items-center justify-between rounded-xl border border-[#E60000]/20 bg-[#E60000]/5 p-3">
                <span className="text-xs font-black uppercase tracking-widest text-white">
                  Maks weekend
                </span>
                <div className="text-right">
                  <span className="text-xl font-black text-[#E60000]">78</span>
                  <span className="ml-1 text-[10px] font-bold text-gray-500">
                    PKT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MY SCORE HERO CARD ── */}
      {myScore && (
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#E60000]/20 bg-gradient-to-br from-[#E60000]/15 via-[#1C1C1E] to-[#141416] p-6">
          {/* Animated glowing ring */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#E60000]/20 opacity-50" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-[#E60000]/10" />

          <div className="relative">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#E60000]/60">
                  Twoje punkty
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tabular-nums leading-none text-white">
                    {myScore.totalPoints}
                  </span>
                  <span className="text-lg font-bold text-[#E60000]/40">
                    /78
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1.5 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-1.5">
                  <Target className="h-3 w-3 text-green-400" />
                  <span className="text-sm font-black text-green-400">
                    {myScore.perfectPredictions}
                  </span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
                  Trafień
                </span>
              </div>
            </div>

            {/* Score progress bar */}
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#E60000] to-[#ff4444] transition-all duration-1000 ease-out"
                style={{
                  width: `${(myScore.totalPoints / 78) * 100}%`,
                }}
              />
            </div>

            {/* Bonus badges */}
            {myDetails &&
              (myDetails.bonusP1 > 0 || myDetails.bonusPodium > 0) && (
                <div className="flex flex-wrap gap-2">
                  {myDetails.bonusP1 > 0 && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-[#E60000]/30 bg-[#E60000]/10 px-3 py-1.5">
                      <Crown className="h-3 w-3 text-[#E60000]" />
                      <span className="text-[10px] font-black text-[#E60000]">
                        P1 BONUS +{myDetails.bonusP1}
                      </span>
                    </div>
                  )}
                  {myDetails.bonusPodium > 0 && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-[#E60000]/30 bg-[#E60000]/10 px-3 py-1.5">
                      <Trophy className="h-3 w-3 text-[#E60000]" />
                      <span className="text-[10px] font-black text-[#E60000]">
                        PODIUM +{myDetails.bonusPodium}
                      </span>
                    </div>
                  )}
                </div>
              )}

            {myDetails?.fromSeason && (
              <div className="mt-3 rounded-xl border border-white/5 bg-[#0D0D0D]/80 px-4 py-2.5 text-[10px] text-gray-400">
                📋 Typy z{" "}
                <span className="font-bold text-white">
                  predykcji sezonowej
                </span>{" "}
                — nie oddałeś typów na ten wyścig
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MY DETAILED PREDICTIONS ── */}
      {myDetails && myDetails.predictions.length > 0 && (
        <Section
          id="predictions"
          icon={<Target className="h-4 w-4 text-[#E60000]" />}
          title="Twoje TOP 10 Typy"
          expanded={expandedSection === "predictions"}
          onToggle={() => toggleSection("predictions")}
        >
          <div className="space-y-1.5">
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
                      "group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3.5 transition-all",
                      isPerfect
                        ? "border-[#E60000]/40 bg-gradient-to-r from-[#E60000]/10 to-transparent"
                        : pred.inTop10
                          ? "border-green-500/15 bg-[#1A1D1A]"
                          : "border-white/[0.04] bg-[#161618] opacity-50"
                    )}
                  >
                    {/* Left color accent */}
                    {isPerfect && (
                      <div className="absolute bottom-0 left-0 top-0 w-[3px] rounded-full bg-[#E60000]" />
                    )}

                    {/* Position badge */}
                    <div
                      className={clsx(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black",
                        pred.predictedPos === 1
                          ? "bg-[#E60000] text-white shadow-lg shadow-red-900/40"
                          : pred.predictedPos <= 3
                            ? "bg-[#E60000]/15 text-[#E60000]"
                            : "bg-[#2C2C2E] text-gray-500"
                      )}
                    >
                      P{pred.predictedPos}
                    </div>

                    {/* Driver info */}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-white">
                        {driver.name}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getTeamLogo(driver.team)}
                          alt=""
                          className="h-3 w-3 object-contain"
                        />
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                          {driver.team}
                        </span>
                      </div>
                    </div>

                    {/* Result */}
                    <div className="shrink-0 text-right">
                      {pred.inTop10 && pred.actualPos ? (
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col items-end">
                            <div
                              className={clsx(
                                "text-[10px] font-black",
                                isPerfect
                                  ? "text-[#E60000]"
                                  : diff && diff <= 2
                                    ? "text-green-400"
                                    : "text-gray-400"
                              )}
                            >
                              → P{pred.actualPos}
                            </div>
                            <div className="mt-0.5 flex gap-1 text-[8px]">
                              {pred.selectionPoints > 0 && (
                                <span className="rounded bg-green-500/10 px-1 py-0.5 font-bold text-green-500">
                                  +{pred.selectionPoints}
                                </span>
                              )}
                              {pred.positionPoints > 0 && (
                                <span className="rounded bg-yellow-500/10 px-1 py-0.5 font-bold text-yellow-500">
                                  +{pred.positionPoints}
                                  {diff === 0
                                    ? "✓"
                                    : ` ±${diff}`}
                                </span>
                              )}
                            </div>
                          </div>
                          <div
                            className={clsx(
                              "flex h-9 min-w-[40px] items-center justify-center rounded-xl text-sm font-black",
                              isPerfect
                                ? "bg-[#E60000] text-white shadow-lg shadow-red-900/30"
                                : pred.points > 3
                                  ? "bg-green-500/15 text-green-400"
                                  : pred.points > 0
                                    ? "bg-green-500/10 text-green-400/80"
                                    : "bg-[#2C2C2E] text-gray-600"
                            )}
                          >
                            +{pred.points}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-gray-600">
                            Poza TOP 10
                          </span>
                          <div className="flex h-9 min-w-[40px] items-center justify-center rounded-xl bg-[#2C2C2E] text-sm font-black text-gray-600">
                            +0
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </Section>
      )}

      {/* ── ACTUAL TOP 10 ── */}
      <Section
        id="classification"
        icon={<Flag className="h-4 w-4 text-[#E60000]" />}
        title="Klasyfikacja TOP 10"
        expanded={expandedSection === "classification"}
        onToggle={() => toggleSection("classification")}
      >
        <div className="space-y-1.5">
          {raceData.results.slice(0, 10).map((driverId, position) => {
            const driver = drivers.find((d) => d.slug === driverId);
            if (!driver) return null;

            return (
              <div
                key={driverId}
                className={clsx(
                  "relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3.5 transition-all",
                  position === 0
                    ? "border-[#E60000]/30 bg-gradient-to-r from-[#E60000]/10 to-transparent"
                    : position <= 2
                      ? "border-white/[0.06] bg-[#1A1A1D]"
                      : "border-white/[0.04] bg-[#161618]"
                )}
              >
                {position === 0 && (
                  <div className="absolute bottom-0 left-0 top-0 w-[3px] rounded-full bg-[#E60000]" />
                )}

                <div
                  className={clsx(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black",
                    position === 0
                      ? "bg-[#E60000] text-white shadow-lg shadow-red-900/40"
                      : position === 1
                        ? "bg-gray-500/80 text-white"
                        : position === 2
                          ? "bg-orange-700/80 text-white"
                          : "bg-[#2C2C2E] text-gray-500"
                  )}
                >
                  {position + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-white">
                    {driver.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getTeamLogo(driver.team)}
                      alt=""
                      className="h-3 w-3 object-contain"
                    />
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                      {driver.team}
                    </span>
                  </div>
                </div>

                <div
                  className="h-6 w-1.5 rounded-full opacity-70"
                  style={{
                    backgroundColor:
                      driver.color.split(" ")[0] || "#666",
                  }}
                />
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── ROUND RANKING ── */}
      {raceData.scores.length > 0 && (
        <Section
          id="ranking"
          icon={<Trophy className="h-4 w-4 text-[#E60000]" />}
          title="Ranking Rundy"
          expanded={expandedSection === "ranking"}
          onToggle={() => toggleSection("ranking")}
        >
          <div className="space-y-1.5">
            {raceData.scores.map((score, index) => {
              const isMe = score.user.id === user?.id;
              const details = score.details as ScoreDetails | null;

              return (
                <div
                  key={score.userId}
                  className={clsx(
                    "relative flex items-center justify-between overflow-hidden rounded-2xl border p-3.5 transition-all",
                    isMe
                      ? "border-[#E60000]/30 bg-gradient-to-r from-[#E60000]/10 to-transparent"
                      : "border-white/[0.04] bg-[#161618]"
                  )}
                >
                  {isMe && (
                    <div className="absolute bottom-0 left-0 top-0 w-[3px] rounded-full bg-[#E60000]" />
                  )}

                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <div
                      className={clsx(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black",
                        index === 0
                          ? "bg-[#E60000] text-white shadow-lg shadow-red-900/40"
                          : index === 1
                            ? "bg-gray-500/80 text-white"
                            : index === 2
                              ? "bg-orange-700/80 text-white"
                              : "bg-[#2C2C2E] text-gray-500"
                      )}
                    >
                      {index + 1}
                    </div>

                    {/* Avatar */}
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-white/10 bg-gray-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          score.user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(score.user.name || "U")}&background=E60000&color=fff&bold=true`
                        }
                        alt={score.user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Name + badges */}
                    <div>
                      <div
                        className={clsx(
                          "text-sm font-bold",
                          isMe ? "text-[#E60000]" : "text-white"
                        )}
                      >
                        {score.user.name || "Anonim"}
                        {isMe && (
                          <span className="ml-1.5 rounded-md bg-[#E60000]/20 px-1.5 py-0.5 text-[9px] font-black text-[#E60000]">
                            TY
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex gap-1">
                        {details?.fromSeason && (
                          <span className="rounded bg-gray-700/50 px-1.5 py-0.5 text-[8px] font-bold text-gray-400">
                            SEZON
                          </span>
                        )}
                        {details?.bonusP1 ? (
                          <span className="rounded bg-[#E60000]/15 px-1.5 py-0.5 text-[8px] font-bold text-[#E60000]">
                            P1
                          </span>
                        ) : null}
                        {details?.bonusPodium ? (
                          <span className="rounded bg-[#E60000]/15 px-1.5 py-0.5 text-[8px] font-bold text-[#E60000]">
                            PODIUM
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-xl font-black tabular-nums text-white">
                        {score.totalPoints}
                      </span>
                      <span className="text-[9px] font-bold text-[#E60000]">
                        PKT
                      </span>
                    </div>
                    {score.perfectPredictions > 0 && (
                      <div className="mt-0.5 text-[9px] font-bold text-green-400">
                        ✨ {score.perfectPredictions} trafień
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}

/* ── COLLAPSIBLE SECTION COMPONENT ── */
function Section({
  id,
  icon,
  title,
  expanded,
  onToggle,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="group mb-2 flex w-full items-center justify-between rounded-2xl border border-white/[0.06] bg-[#1C1C1E] px-4 py-3 text-left transition-all hover:border-white/10 hover:bg-[#222225]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E60000]/10">
            {icon}
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
            {title}
          </span>
        </div>
        <ChevronDown
          className={clsx(
            "h-4 w-4 text-gray-500 transition-transform duration-300",
            expanded && "rotate-180"
          )}
        />
      </button>

      <div
        className={clsx(
          "grid transition-all duration-300 ease-in-out",
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}