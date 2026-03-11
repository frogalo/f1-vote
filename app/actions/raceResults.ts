"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper to verify the current user is admin
async function requireAdmin() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) throw new Error("Nie zalogowano");

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isAdmin: true },
    });

    if (!user?.isAdmin) throw new Error("Brak uprawnień administratora");
    return true;
}

/**
 * NEW SCORING SYSTEM (v2):
 * All 22 drivers are scored (not just top 10).
 * No selection bonus.
 * Position accuracy:
 *   - diff 0 (perfect): +3
 *   - diff 1: +2
 *   - diff 2: +1
 *   - diff ≥3: +0
 *
 * Bonuses:
 *   - Perfect P1: +1
 *   - Perfect full podium (P1, P2, P3 all correct): +3
 *
 * Max per driver: 3
 * Max base: 66 (22 × 3)
 * Max total: 70 (66 + 1 + 3)
 */

const POSITION_POINTS: Record<number, number> = {
    0: 3,
    1: 2,
    2: 1,
};

function calculatePositionPoints(diff: number): number {
    return POSITION_POINTS[diff] ?? 0;
}

/**
 * Finish a race: set the final results order and calculate points for all users
 */
export async function finishRace(round: number, results: string[]) {
    await requireAdmin();

    if (!results || results.length === 0) {
        return { error: "Musisz podać kolejność kierowców" };
    }

    const fullResults = results; // all drivers in finish order

    try {
        // 1. Update race as completed with results
        await prisma.race.update({
            where: { round },
            data: {
                completed: true,
                results,
            },
        });

        // 2. Get all votes for this race from all users (all positions)
        const votes = await prisma.vote.findMany({
            where: {
                raceRound: { startsWith: `race-${round}-position-` },
            },
            include: {
                user: { select: { id: true } },
            },
        });

        // 3. Group votes by user
        const votesByUser = new Map<string, typeof votes>();
        for (const vote of votes) {
            const userId = vote.userId;
            if (!votesByUser.has(userId)) {
                votesByUser.set(userId, []);
            }
            votesByUser.get(userId)!.push(vote);
        }

        // 3b. Fallback: for users who have season votes but no race votes,
        //     use their season predictions as race predictions
        const usersWhoVoted = new Set(votesByUser.keys());
        const seasonVotes = await prisma.seasonVote.findMany({
            where: {
                season: 2026,
                userId: { notIn: Array.from(usersWhoVoted) },
                user: {
                    isAdmin: false,
                    NOT: [
                        { username: "testadmin" },
                        { name: "testadmin" },
                    ],
                },
            },
            include: {
                driver: { select: { slug: true, activeSeason: true } },
            },
        });

        // Group season votes by user and build synthetic race votes
        const seasonByUser = new Map<string, typeof seasonVotes>();
        for (const sv of seasonVotes) {
            if (!sv.driver.activeSeason) continue; // skip inactive drivers
            if (!seasonByUser.has(sv.userId)) {
                seasonByUser.set(sv.userId, []);
            }
            seasonByUser.get(sv.userId)!.push(sv);
        }

        // Convert season votes into the same shape as race votes
        for (const [userId, userSeasonVotes] of seasonByUser.entries()) {
            const syntheticVotes = userSeasonVotes.map((sv, i) => ({
                id: `season-fallback-${sv.id}`,
                userId,
                driverId: sv.driver.slug,
                raceRound: `race-${round}-position-${i + 1}`, // re-compact positions
                createdAt: sv.createdAt,
                user: { id: userId },
            }));
            votesByUser.set(userId, syntheticVotes as typeof votes);
        }

        // 4. Calculate scores for each user
        const scoreOps = [];
        for (const [userId, userVotes] of votesByUser.entries()) {
            let totalPoints = 0;
            let perfectPredictions = 0;
            const isFromSeason = userVotes.length > 0 && userVotes[0].id.startsWith("season-fallback-");
            const details: Array<{
                driverId: string;
                predictedPos: number;
                actualPos: number | null;
                positionPoints: number;
                points: number;
            }> = [];

            // Score ALL driver predictions (all 22)
            for (const vote of userVotes) {
                const parts = vote.raceRound.split("-");
                const predictedPos = parseInt(parts[3]); // 1-based
                const actualIndex = fullResults.indexOf(vote.driverId);
                const actualPos = actualIndex !== -1 ? actualIndex + 1 : null; // 1-based or null

                let positionPoints = 0;

                if (actualPos !== null) {
                    const diff = Math.abs(predictedPos - actualPos);
                    positionPoints = calculatePositionPoints(diff);

                    if (diff === 0) {
                        perfectPredictions++;
                    }
                }

                totalPoints += positionPoints;

                details.push({
                    driverId: vote.driverId,
                    predictedPos,
                    actualPos,
                    positionPoints,
                    points: positionPoints,
                });
            }

            // ── Bonuses ──
            let bonusP1 = 0;
            let bonusPodium = 0;

            // Perfect P1 bonus: +1
            const p1Vote = details.find(d => d.predictedPos === 1);
            if (p1Vote && p1Vote.actualPos === 1) {
                bonusP1 = 1;
                totalPoints += bonusP1;
            }

            // Perfect podium bonus: +3 (P1, P2, P3 all exactly correct)
            const p1 = details.find(d => d.predictedPos === 1 && d.actualPos === 1);
            const p2 = details.find(d => d.predictedPos === 2 && d.actualPos === 2);
            const p3 = details.find(d => d.predictedPos === 3 && d.actualPos === 3);
            if (p1 && p2 && p3) {
                bonusPodium = 3;
                totalPoints += bonusPodium;
            }

            // Upsert score for this user + race
            const detailsWithBonuses = {
                predictions: details,
                bonusP1,
                bonusPodium,
                fromSeason: isFromSeason,
            };

            scoreOps.push(
                prisma.raceScore.upsert({
                    where: {
                        userId_raceRound_isSprint: { userId, raceRound: round, isSprint: false },
                    },
                    update: {
                        totalPoints,
                        perfectPredictions,
                        details: JSON.parse(JSON.stringify(detailsWithBonuses)),
                    },
                    create: {
                        userId,
                        raceRound: round,
                        isSprint: false,
                        totalPoints,
                        perfectPredictions,
                        details: JSON.parse(JSON.stringify(detailsWithBonuses)),
                    },
                })
            );
        }

        await Promise.all(scoreOps);

        revalidatePath("/admin");
        revalidatePath("/leaderboard");
        revalidatePath(`/race/${round}/results`);
        revalidatePath("/calendar");

        return { success: true, usersScored: votesByUser.size };
    } catch (e: unknown) {
        return { error: (e instanceof Error ? e.message : String(e)) || "Błąd zakończenia wyścigu" };
    }
}

/**
 * Finish a sprint: set sprint results and calculate sprint points
 */
export async function finishSprint(round: number, results: string[]) {
    await requireAdmin();

    if (!results || results.length === 0) {
        return { error: "Musisz podać kolejność kierowców" };
    }

    const fullResults = results;

    try {
        // 1. Update race sprint as completed
        await prisma.race.update({
            where: { round },
            data: {
                sprintCompleted: true,
                sprintResults: results,
            },
        });

        // 2. Get all sprint votes
        const votes = await prisma.vote.findMany({
            where: {
                raceRound: { startsWith: `sprint-${round}-position-` },
            },
            include: {
                user: { select: { id: true } },
            },
        });

        // 3. Group votes by user
        const votesByUser = new Map<string, typeof votes>();
        for (const vote of votes) {
            const userId = vote.userId;
            if (!votesByUser.has(userId)) {
                votesByUser.set(userId, []);
            }
            votesByUser.get(userId)!.push(vote);
        }

        // 3b. Fallback: use season votes for users without sprint votes
        const usersWhoVoted = new Set(votesByUser.keys());
        const seasonVotes = await prisma.seasonVote.findMany({
            where: {
                season: 2026,
                userId: { notIn: Array.from(usersWhoVoted) },
                user: {
                    isAdmin: false,
                    NOT: [
                        { username: "testadmin" },
                        { name: "testadmin" },
                    ],
                },
            },
            include: {
                driver: { select: { slug: true, activeSeason: true } },
            },
        });

        const seasonByUser = new Map<string, typeof seasonVotes>();
        for (const sv of seasonVotes) {
            if (!sv.driver.activeSeason) continue;
            if (!seasonByUser.has(sv.userId)) {
                seasonByUser.set(sv.userId, []);
            }
            seasonByUser.get(sv.userId)!.push(sv);
        }

        for (const [userId, userSeasonVotes] of seasonByUser.entries()) {
            const syntheticVotes = userSeasonVotes.map((sv, i) => ({
                id: `season-fallback-${sv.id}`,
                userId,
                driverId: sv.driver.slug,
                raceRound: `sprint-${round}-position-${i + 1}`,
                createdAt: sv.createdAt,
                user: { id: userId },
            }));
            votesByUser.set(userId, syntheticVotes as typeof votes);
        }

        // 4. Calculate scores
        const scoreOps = [];
        for (const [userId, userVotes] of votesByUser.entries()) {
            let totalPoints = 0;
            let perfectPredictions = 0;
            const isFromSeason = userVotes.length > 0 && userVotes[0].id.startsWith("season-fallback-");
            const details: Array<{
                driverId: string;
                predictedPos: number;
                actualPos: number | null;
                positionPoints: number;
                points: number;
            }> = [];

            for (const vote of userVotes) {
                const parts = vote.raceRound.split("-");
                const predictedPos = parseInt(parts[3]);
                const actualIndex = fullResults.indexOf(vote.driverId);
                const actualPos = actualIndex !== -1 ? actualIndex + 1 : null;

                let positionPoints = 0;

                if (actualPos !== null) {
                    const diff = Math.abs(predictedPos - actualPos);
                    positionPoints = calculatePositionPoints(diff);

                    if (diff === 0) {
                        perfectPredictions++;
                    }
                }

                totalPoints += positionPoints;

                details.push({
                    driverId: vote.driverId,
                    predictedPos,
                    actualPos,
                    positionPoints,
                    points: positionPoints,
                });
            }

            // Sprint bonuses (same as race)
            let bonusP1 = 0;
            let bonusPodium = 0;

            const p1Vote = details.find(d => d.predictedPos === 1);
            if (p1Vote && p1Vote.actualPos === 1) {
                bonusP1 = 1;
                totalPoints += bonusP1;
            }

            const p1 = details.find(d => d.predictedPos === 1 && d.actualPos === 1);
            const p2 = details.find(d => d.predictedPos === 2 && d.actualPos === 2);
            const p3 = details.find(d => d.predictedPos === 3 && d.actualPos === 3);
            if (p1 && p2 && p3) {
                bonusPodium = 3;
                totalPoints += bonusPodium;
            }

            const detailsWithBonuses = {
                predictions: details,
                bonusP1,
                bonusPodium,
                fromSeason: isFromSeason,
            };

            scoreOps.push(
                prisma.raceScore.upsert({
                    where: {
                        userId_raceRound_isSprint: { userId, raceRound: round, isSprint: true },
                    },
                    update: {
                        totalPoints,
                        perfectPredictions,
                        details: JSON.parse(JSON.stringify(detailsWithBonuses)),
                    },
                    create: {
                        userId,
                        raceRound: round,
                        isSprint: true,
                        totalPoints,
                        perfectPredictions,
                        details: JSON.parse(JSON.stringify(detailsWithBonuses)),
                    },
                })
            );
        }

        await Promise.all(scoreOps);

        revalidatePath("/admin");
        revalidatePath("/leaderboard");
        revalidatePath(`/race/${round}/results`);
        revalidatePath("/calendar");

        return { success: true, usersScored: votesByUser.size };
    } catch (e: unknown) {
        return { error: (e instanceof Error ? e.message : String(e)) || "Błąd zakończenia sprintu" };
    }
}

/**
 * Reopen a race (undo finish)
 */
export async function reopenRace(round: number) {
    await requireAdmin();

    try {
        // Delete race scores (not sprint)
        await prisma.raceScore.deleteMany({
            where: { raceRound: round, isSprint: false },
        });

        // Reset race completion
        await prisma.race.update({
            where: { round },
            data: {
                completed: false,
                results: [],
            },
        });

        revalidatePath("/admin");
        revalidatePath("/leaderboard");
        revalidatePath(`/race/${round}/results`);
        revalidatePath(`/race/${round}`);
        revalidatePath("/calendar");

        return { success: true };
    } catch (e: unknown) {
        return { error: (e instanceof Error ? e.message : String(e)) || "Błąd cofania zakończenia wyścigu" };
    }
}

/**
 * Reopen a sprint (undo sprint finish)
 */
export async function reopenSprint(round: number) {
    await requireAdmin();

    try {
        await prisma.raceScore.deleteMany({
            where: { raceRound: round, isSprint: true },
        });

        await prisma.race.update({
            where: { round },
            data: {
                sprintCompleted: false,
                sprintResults: [],
            },
        });

        revalidatePath("/admin");
        revalidatePath("/leaderboard");
        revalidatePath(`/race/${round}/results`);
        revalidatePath(`/race/${round}`);
        revalidatePath("/calendar");

        return { success: true };
    } catch (e: unknown) {
        return { error: (e instanceof Error ? e.message : String(e)) || "Błąd cofania zakończenia sprintu" };
    }
}

/**
 * Get race data with results and scores
 */
export async function getRaceWithResults(round: number, isSprint: boolean = false) {
    const race = await prisma.race.findUnique({
        where: { round },
        include: {
            scores: {
                where: {
                    isSprint,
                    user: {
                        NOT: [
                            { username: "testadmin" },
                            { name: "testadmin" }
                        ]
                    }
                },
                include: {
                    user: { select: { id: true, name: true, avatar: true } },
                },
                orderBy: { totalPoints: "desc" },
            },
        },
    });

    return race;
}

/**
 * Get leaderboard data: aggregate scores across all completed races
 */
export async function getLeaderboardScores() {
    // Get all non-admin users
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
            raceScores: {
                select: {
                    raceRound: true,
                    totalPoints: true,
                    perfectPredictions: true,
                },
            },
        },
        orderBy: { name: "asc" },
    });

    return users.map((u) => {
        const totalPoints = u.raceScores.reduce((sum, s) => sum + s.totalPoints, 0);
        const perfectPredictions = u.raceScores.reduce((sum, s) => sum + s.perfectPredictions, 0);
        const racesScored = u.raceScores.length;

        return {
            id: u.id,
            name: u.name || "Anonim",
            team: u.team?.name || "Brak zespołu",
            avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=E60000&color=fff&bold=true`,
            totalPoints,
            perfectPredictions,
            racesScored,
        };
    });
}

/**
 * Get all active drivers (for the finish race UI)
 */
export async function getActiveDriversForResults() {
    const drivers = await prisma.driver.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
        include: { team: { select: { name: true } } },
    });

    return drivers.map((d) => ({
        slug: d.slug,
        name: d.name,
        number: d.number,
        team: d.team.name,
        color: d.color || "bg-gray-500",
        country: d.country || "XX",
    }));
}

/**
 * Get scores for a specific user (for calendar display)
 */
export async function getLeaderboardScoresForUser(userId: string) {
    const scores = await prisma.raceScore.findMany({
        where: { userId },
        select: {
            raceRound: true,
            isSprint: true,
            totalPoints: true,
        },
    });

    const grouped = scores.reduce((acc, score) => {
        if (!acc[score.raceRound]) {
            acc[score.raceRound] = { 
                raceRound: score.raceRound, 
                totalPoints: 0, 
                racePoints: 0, 
                sprintPoints: 0 
            };
        }
        acc[score.raceRound].totalPoints += score.totalPoints;
        if (score.isSprint) {
            acc[score.raceRound].sprintPoints += score.totalPoints;
        } else {
            acc[score.raceRound].racePoints += score.totalPoints;
        }
        return acc;
    }, {} as Record<number, { raceRound: number, totalPoints: number, racePoints: number, sprintPoints: number }>);

    return Object.values(grouped);
}

