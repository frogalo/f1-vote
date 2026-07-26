"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { isSeasonLocked } from "./seasonVote";

async function getAuthUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("userId")?.value || null;
}

export type UserRoundProgress = {
    round: number;
    location: string;
    roundPoints: number;
    cumulativePoints: number;
};

export type DriverStatItem = {
    name: string;
    value: number;
};

export type UserStats = {
    id: string;
    name: string;
    avatar: string;
    teamName: string | null;
    favoriteDriverName: string | null;
    totalPoints: number;
    averagePoints: number;
    maxRoundPoints: number;
    perfectPredictionsCount: number;
    roundsWonCount: number;
    roundProgress: UserRoundProgress[];
    seasonPredictions: {
        champion: string | null;
        fastestLap: string | null;
        fastestPitstop: string | null;
        mostDotd: string | null;
        mostDnf: string | null;
        collision: boolean | null;
        rain: boolean | null;
    } | null;
    driverStats: {
        mostPopular: DriverStatItem | null;  // lowest average predicted position
        leastPopular: DriverStatItem | null; // highest average predicted position
        mostAccurate: DriverStatItem | null; // highest points scored
        leastAccurate: DriverStatItem | null; // highest average position error
    } | null;
};

export async function getStatsData() {
    const currentUserId = await getAuthUserId();
    const locked = await isSeasonLocked();

    // 1. Fetch completed races
    const completedRaces = await prisma.race.findMany({
        where: { completed: true },
        orderBy: { round: "asc" },
        select: {
            round: true,
            name: true,
            location: true,
            results: true,
        }
    });

    // 2. Fetch driver names for mapping
    const drivers = await prisma.driver.findMany({
        select: { slug: true, name: true }
    });
    const driverNameMap = new Map(drivers.map(d => [d.slug, d.name]));

    // 3. Fetch all race votes
    const allVotes = await prisma.vote.findMany({
        where: {
            raceRound: { startsWith: "race-" }
        },
        select: {
            userId: true,
            driverId: true,
            raceRound: true,
        }
    });

    // Group votes by user
    const votesByUser = new Map<string, typeof allVotes>();
    allVotes.forEach(v => {
        if (!votesByUser.has(v.userId)) {
            votesByUser.set(v.userId, []);
        }
        votesByUser.get(v.userId)!.push(v);
    });

    // 4. Fetch users and their scores, including votes for season predictions
    const users = await prisma.user.findMany({
        where: {
            isAdmin: false,
            NOT: [
                { username: "testadmin" },
                { name: "testadmin" }
            ]
        },
        select: {
            id: true,
            name: true,
            avatar: true,
            team: { select: { name: true } },
            favoriteDriver: { select: { name: true, slug: true } },
            raceScores: {
                orderBy: { raceRound: "asc" },
                select: {
                    raceRound: true,
                    totalPoints: true,
                    perfectPredictions: true,
                    isSprint: true,
                }
            },
            seasonVotes: {
                where: { position: 1 }, // position 1 is the predicted champion
                select: {
                    driver: { select: { name: true } }
                }
            },
            fastestLapDriver: { select: { name: true } },
            fastestPitstopTeam: { select: { name: true } },
            mostDotdDriver: { select: { name: true } },
            mostDnfRange: true,
            firstRaceCollision: true,
            firstRaceRain: true,
        },
        orderBy: { name: "asc" },
    });

    // 5. Compute rounds won count
    const roundWinners = new Map<number, string[]>(); // round -> array of userIds
    completedRaces.forEach(race => {
        let maxPts = -1;
        let winners: string[] = [];
        
        users.forEach(u => {
            const scoresForRound = u.raceScores.filter(s => s.raceRound === race.round);
            const roundPoints = scoresForRound.reduce((sum, s) => sum + s.totalPoints, 0);
            if (roundPoints > maxPts) {
                maxPts = roundPoints;
                winners = [u.id];
            } else if (roundPoints === maxPts) {
                winners.push(u.id);
            }
        });

        // Only count as winner if they scored more than 0 points
        if (maxPts > 0) {
            roundWinners.set(race.round, winners);
        }
    });

    // 6. Map user details and points progression
    const usersData: UserStats[] = users.map(u => {
        // Calculate round-by-round points progress
        let cumulative = 0;
        const roundProgress: UserRoundProgress[] = completedRaces.map(race => {
            const scoresForRound = u.raceScores.filter(s => s.raceRound === race.round);
            const roundPoints = scoresForRound.reduce((sum, s) => sum + s.totalPoints, 0);
            cumulative += roundPoints;
            return {
                round: race.round,
                location: race.location || `Runda ${race.round}`,
                roundPoints,
                cumulativePoints: cumulative
            };
        });

        const totalPoints = cumulative;
        const averagePoints = completedRaces.length > 0 ? parseFloat((totalPoints / completedRaces.length).toFixed(1)) : 0;
        
        const maxRoundPoints = roundProgress.length > 0
            ? Math.max(...roundProgress.map(rp => rp.roundPoints))
            : 0;

        const perfectPredictionsCount = u.raceScores.reduce((sum, s) => sum + s.perfectPredictions, 0);

        // Count rounds won
        let roundsWonCount = 0;
        roundWinners.forEach(winners => {
            if (winners.includes(u.id)) {
                roundsWonCount++;
            }
        });

        // Season predictions: obscure other users' predictions unless locked
        const isSelf = u.id === currentUserId;
        const canSeePredictions = locked || isSelf;

        const seasonPredictions = canSeePredictions ? {
            champion: u.seasonVotes[0]?.driver.name || null,
            fastestLap: u.fastestLapDriver?.name || null,
            fastestPitstop: u.fastestPitstopTeam?.name || null,
            mostDotd: u.mostDotdDriver?.name || null,
            mostDnf: u.mostDnfRange || null,
            collision: u.firstRaceCollision,
            rain: u.firstRaceRain,
        } : null;

        // Calculate driver prediction statistics
        const userVotes = votesByUser.get(u.id) || [];
        const driverPicks = new Map<string, { positions: number[]; points: number[]; errors: number[] }>();

        userVotes.forEach(v => {
            const parts = v.raceRound.split("-");
            const round = parseInt(parts[1]);
            const position = parseInt(parts[3]);
            if (isNaN(round) || isNaN(position)) return;

            if (!driverPicks.has(v.driverId)) {
                driverPicks.set(v.driverId, { positions: [], points: [], errors: [] });
            }
            const data = driverPicks.get(v.driverId)!;
            data.positions.push(position);

            const raceResult = completedRaces.find(r => r.round === round);
            if (raceResult) {
                const actualPos = raceResult.results.indexOf(v.driverId) + 1;
                if (actualPos > 0) {
                    const error = Math.abs(position - actualPos);
                    const pts = Math.max(0, 3 - error);
                    data.points.push(pts);
                    data.errors.push(error);
                }
            }
        });

        let mostPopular: DriverStatItem | null = null;
        let leastPopular: DriverStatItem | null = null;
        let mostAccurate: DriverStatItem | null = null;
        let leastAccurate: DriverStatItem | null = null;

        let minAvgPos = Infinity;
        let maxAvgPos = -Infinity;
        let maxPtsVal = -Infinity;
        let maxErrVal = -Infinity;

        driverPicks.forEach((data, driverId) => {
            const driverName = driverNameMap.get(driverId) || driverId;

            if (data.positions.length > 0) {
                const avgPos = data.positions.reduce((sum, p) => sum + p, 0) / data.positions.length;
                if (avgPos < minAvgPos) {
                    minAvgPos = avgPos;
                    mostPopular = { name: driverName, value: parseFloat(avgPos.toFixed(1)) };
                }
                if (avgPos > maxAvgPos) {
                    maxAvgPos = avgPos;
                    leastPopular = { name: driverName, value: parseFloat(avgPos.toFixed(1)) };
                }
            }

            if (data.points.length > 0) {
                const totPts = data.points.reduce((sum, p) => sum + p, 0);
                if (totPts > maxPtsVal) {
                    maxPtsVal = totPts;
                    mostAccurate = { name: driverName, value: totPts };
                }
            }

            if (data.errors.length > 0) {
                const avgErr = data.errors.reduce((sum, e) => sum + e, 0) / data.errors.length;
                if (avgErr > maxErrVal) {
                    maxErrVal = avgErr;
                    leastAccurate = { name: driverName, value: parseFloat(avgErr.toFixed(1)) };
                }
            }
        });

        const driverStats = driverPicks.size > 0 ? {
            mostPopular,
            leastPopular,
            mostAccurate,
            leastAccurate
        } : null;

        return {
            id: u.id,
            name: u.name || "Anonim",
            avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=E60000&color=fff&bold=true`,
            teamName: u.team?.name || null,
            favoriteDriverName: u.favoriteDriver?.name || null,
            totalPoints,
            averagePoints,
            maxRoundPoints,
            perfectPredictionsCount,
            roundsWonCount,
            roundProgress,
            seasonPredictions,
            driverStats,
        };
    });

    // Sort usersData by totalPoints (descending), then perfectPredictionsCount (descending)
    usersData.sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        return b.perfectPredictionsCount - a.perfectPredictionsCount;
    });

    return {
        completedRacesCount: completedRaces.length,
        roundsLabels: ["Start", ...completedRaces.map(r => r.location || `R${r.round}`)],
        usersData,
        seasonLocked: locked,
    };
}
