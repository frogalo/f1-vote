"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// F1 2026 points system: top 10 only
const F1_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
function getF1Points(position: number | null): number {
  if (position === null || position < 1 || position > 10) return 0;
  return F1_POINTS[position - 1];
}

export type WrappedData = {
  // Race info
  raceName: string;
  raceLocation: string;
  raceRound: number;

  // User score
  userPoints: number;
  maxPoints: number; // 78
  perfectPredictions: number;
  bonusP1: number;
  bonusPodium: number;

  // Rank
  userRank: number;
  totalPlayers: number;
  playersBeaten: number; // how many players ranked below user
  pointsToFirst: number;

  // Favorite driver
  favoriteDriverName: string | null;
  favoriteDriverSlug: string | null;
  favoriteDriverFinishPos: number | null; // null if DNF/outside results
  favoriteDriverInTop10: boolean;
  favoriteDriverF1Points: number; // real F1 championship points

  // Favorite team
  favoriteTeamName: string | null;
  favoriteTeamDriverResults: {
    driverName: string;
    finishPos: number | null;
    f1Points: number;
  }[];
  favoriteTeamBestPos: number | null;
  favoriteTeamTotalF1Points: number;

  // All scores for comparison
  allScores: {
    userName: string;
    points: number;
    rank: number;
    isUser: boolean;
    avatar: string;
  }[];

  // Random stats (9 available, 3 shown)
  randomStats: {
    id: string;
    emoji: string;
    title: string;
    value: string;
    description: string;
  }[];

  // Race podium
  podium: {
    driverName: string;
    driverSlug: string;
    teamName: string;
    position: number;
  }[];

  // User avatar
  userAvatar: string | null;
  userName: string | null;
};

export async function getWrappedData(round: number): Promise<WrappedData | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;

  // Get user with favorites
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      avatar: true,
      team: { select: { name: true } },
      favoriteDriver: { select: { name: true, slug: true } },
    },
  });

  if (!user) return null;

  // Get race with results and scores
  const race = await prisma.race.findUnique({
    where: { round },
    include: {
      scores: {
        where: {
          user: {
            NOT: [
              { username: "testadmin" },
              { name: "testadmin" },
            ],
          },
        },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { totalPoints: "desc" },
      },
    },
  });

  if (!race || !race.completed) return null;

  const results = race.results; // driver slugs in finish order
  const top10 = results.slice(0, 10);

  // Get all drivers
  const allDrivers = await prisma.driver.findMany({
    where: { active: true },
    include: { team: { select: { name: true } } },
  });

  const driverMap = new Map(allDrivers.map(d => [d.slug, d]));

  // User score
  const myScore = race.scores.find(s => s.user.id === userId);
  const userPoints = myScore?.totalPoints ?? 0;
  const perfectPredictions = myScore?.perfectPredictions ?? 0;
  const details = myScore?.details as any;
  const bonusP1 = details?.bonusP1 ?? 0;
  const bonusPodium = details?.bonusPodium ?? 0;

  // Rank
  const sortedScores = [...race.scores].sort((a, b) => b.totalPoints - a.totalPoints);
  const userRank = sortedScores.findIndex(s => s.user.id === userId) + 1;
  const totalPlayers = sortedScores.length;
  const playersBeaten = totalPlayers > 0 ? totalPlayers - userRank : 0;
  const pointsToFirst = sortedScores.length > 0
    ? sortedScores[0].totalPoints - userPoints
    : 0;

  // Favorite driver result
  const favDriverSlug = user.favoriteDriver?.slug || null;
  const favDriverPos = favDriverSlug ? results.indexOf(favDriverSlug) : -1;

  // Favorite team results
  const favTeamName = user.team?.name || null;
  const teamDriverResults: WrappedData["favoriteTeamDriverResults"] = [];
  let teamBest: number | null = null;
  let teamTotalF1Points = 0;

  if (favTeamName) {
    const teamDrivers = allDrivers.filter(d => d.team.name === favTeamName);
    for (const td of teamDrivers) {
      const pos = results.indexOf(td.slug);
      const finishPos = pos !== -1 ? pos + 1 : null;
      const pts = getF1Points(finishPos);
      teamTotalF1Points += pts;
      teamDriverResults.push({
        driverName: td.name,
        finishPos,
        f1Points: pts,
      });
      if (finishPos !== null && (teamBest === null || finishPos < teamBest)) {
        teamBest = finishPos;
      }
    }
  }

  // Podium
  const podium = results.slice(0, 3).map((slug, i) => {
    const driver = driverMap.get(slug);
    return {
      driverName: driver?.name || slug,
      driverSlug: slug,
      teamName: driver?.team?.name || "Unknown",
      position: i + 1,
    };
  });

  // All scores for comparison 
  const allScores = sortedScores.map((s, i) => ({
    userName: s.user.name || "Anonim",
    points: s.totalPoints,
    rank: i + 1,
    isUser: s.user.id === userId,
    avatar: s.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.user.name || "U")}&background=E60000&color=fff&bold=true`,
  }));

  // ── RANDOM STATS (9 total, pick 3) ──
  // Build all possible stats
  const allRandomStats: WrappedData["randomStats"] = [];

  // 1. How many drivers user predicted correctly in top 10
  const correctInTop10 = details?.predictions?.filter(
    (p: any) => p.inTop10
  ).length ?? 0;
  allRandomStats.push({
    id: "correct_top10",
    emoji: "🎯",
    title: "Trafienia w TOP 10",
    value: `${correctInTop10}/10`,
    description: `Trafiłeś ${correctInTop10} kierowców, którzy ukończyli w TOP 10`,
  });

  // 2. Total position diff (accuracy measure)
  const totalDiff = details?.predictions?.reduce(
    (sum: number, p: any) => sum + (p.actualPos ? Math.abs(p.predictedPos - p.actualPos) : 0), 0
  ) ?? 0;
  allRandomStats.push({
    id: "total_diff",
    emoji: "📏",
    title: "Suma odchyleń",
    value: `${totalDiff}`,
    description: `Łącznie twoje typy odchyliły się o ${totalDiff} pozycji`,
  });

  // 3. Best single prediction
  const bestPred = details?.predictions
    ?.filter((p: any) => p.inTop10 && p.actualPos)
    .sort((a: any, b: any) => Math.abs(a.predictedPos - a.actualPos!) - Math.abs(b.predictedPos - b.actualPos!))[0];
  if (bestPred) {
    const bestDriver = driverMap.get(bestPred.driverId);
    allRandomStats.push({
      id: "best_pred",
      emoji: "💎",
      title: "Najlepszy typ",
      value: bestDriver?.name?.split(" ").pop() || bestPred.driverId,
      description: bestPred.predictedPos === bestPred.actualPos
        ? `Idealnie trafiłeś pozycję P${bestPred.actualPos}!`
        : `Typowałeś P${bestPred.predictedPos}, był P${bestPred.actualPos} (${Math.abs(bestPred.predictedPos - bestPred.actualPos)} poz. różnicy)`,
    });
  }

  // 4. Worst prediction
  const worstPred = details?.predictions
    ?.filter((p: any) => p.inTop10 && p.actualPos)
    .sort((a: any, b: any) => Math.abs(b.predictedPos - b.actualPos!) - Math.abs(a.predictedPos - a.actualPos!))[0];
  if (worstPred && worstPred !== bestPred) {
    const worstDriver = driverMap.get(worstPred.driverId);
    allRandomStats.push({
      id: "worst_pred",
      emoji: "😅",
      title: "Największe pudło",
      value: worstDriver?.name?.split(" ").pop() || worstPred.driverId,
      description: `Typowałeś P${worstPred.predictedPos}, a ukończył P${worstPred.actualPos}`,
    });
  }

  // 5. Average score of all players
  const avgScore =
    totalPlayers > 0
      ? Math.round(sortedScores.reduce((s, x) => s + x.totalPoints, 0) / totalPlayers)
      : 0;
  allRandomStats.push({
    id: "avg_score",
    emoji: "📊",
    title: "Średnia graczy",
    value: `${avgScore} pkt`,
    description: userPoints >= avgScore
      ? `Jesteś powyżej średniej o ${userPoints - avgScore} pkt!`
      : `Średnia to ${avgScore} pkt, brakuje ci ${avgScore - userPoints} pkt`,
  });

  // 6. Winner of the race
  const winnerDriver = driverMap.get(results[0]);
  allRandomStats.push({
    id: "race_winner",
    emoji: "🏆",
    title: "Zwycięzca wyścigu",
    value: winnerDriver?.name?.split(" ").pop() || results[0] || "?",
    description: `${winnerDriver?.name || "Nieznany"} wygrał ten wyścig!`,
  });

  // 7. How many players scored 0
  const zeroScorers = sortedScores.filter(s => s.totalPoints === 0).length;
  allRandomStats.push({
    id: "zero_scorers",
    emoji: "💀",
    title: "Graczy z 0 pkt",
    value: `${zeroScorers}`,
    description: zeroScorers === 0
      ? "Nikt nie wyzerował! Szacunek dla wszystkich."
      : `${zeroScorers} ${zeroScorers === 1 ? "gracz nie zdobył" : "graczy nie zdobyło"} ani jednego punktu`,
  });

  // 8. Highest score this round
  const highestScore = sortedScores[0]?.totalPoints ?? 0;
  const highestScorer = sortedScores[0]?.user.name || "?";
  allRandomStats.push({
    id: "highest_score",
    emoji: "🔥",
    title: "Najlepszy wynik rundy",
    value: `${highestScore} pkt`,
    description: `${highestScorer} zdobył najwięcej punktów w tej rundzie`,
  });

  // 9. Total perfect predictions across all players
  const totalPerfects = sortedScores.reduce((s, x) => s + x.perfectPredictions, 0);
  allRandomStats.push({
    id: "total_perfects",
    emoji: "✨",
    title: "Idealne trafienia",
    value: `${totalPerfects}`,
    description: `Wszyscy gracze razem trafili idealnie ${totalPerfects} ${totalPerfects === 1 ? "pozycję" : "pozycji"}`,
  });

  // Shuffle and pick 3
  const shuffled = allRandomStats
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return {
    raceName: race.name,
    raceLocation: race.location,
    raceRound: race.round,
    userPoints,
    maxPoints: 78,
    perfectPredictions,
    bonusP1,
    bonusPodium,
    userRank,
    totalPlayers,
    playersBeaten,
    pointsToFirst,
    favoriteDriverName: user.favoriteDriver?.name || null,
    favoriteDriverSlug: favDriverSlug,
    favoriteDriverFinishPos: favDriverPos !== -1 ? favDriverPos + 1 : null,
    favoriteDriverInTop10: favDriverPos !== -1 && favDriverPos < 10,
    favoriteDriverF1Points: getF1Points(favDriverPos !== -1 ? favDriverPos + 1 : null),
    favoriteTeamName: favTeamName,
    favoriteTeamDriverResults: teamDriverResults,
    favoriteTeamBestPos: teamBest,
    favoriteTeamTotalF1Points: teamTotalF1Points,
    podium,
    allScores,
    randomStats: shuffled,
    userAvatar: user.avatar,
    userName: user.name,
  };
}
