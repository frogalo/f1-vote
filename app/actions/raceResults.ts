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
 * NEW SCORING SYSTEM:
 * Only the user's top 10 predictions matter.
 * For each predicted driver in user's top 10:
 *   - If driver is in actual top 10: +1 (selection bonus)
 *   - Position accuracy bonus (only if in actual top 10):
 *     - diff 0 (perfect): +6
 *     - diff 1: +4
 *     - diff 2: +3
 *     - diff 3: +2
 *     - diff 4: +1
 *     - diff ≥5: +0
 *   - Max per driver: 7 (1 + 6)
 *   - Max base: 70 (10 × 7)
 * 
 * Bonuses:
 *   - Perfect P1: +3
 *   - Perfect full podium (P1, P2, P3 all correct): +5
 * 
 * Max total: 78
 */

const POSITION_BONUS: Record<number, number> = {
    0: 6,
    1: 4,
    2: 3,
    3: 2,
    4: 1,
};

function calculatePositionBonus(diff: number): number {
    return POSITION_BONUS[diff] ?? 0;
}

/**
 * Finish a race: set the final results order and calculate points for all users
 */
export async function finishRace(round: number, results: string[]) {
    await requireAdmin();

    if (!results || results.length === 0) {
        return { error: "Musisz podać kolejność kierowców" };
    }

    const top10Results = results.slice(0, 10); // actual top 10

    try {
        // 1. Update race as completed with results
        await prisma.race.update({
            where: { round },
            data: {
                completed: true,
                results,
            },
        });

        // 2. Get all votes for this race from all users (only positions 1-10)
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
                position: { lte: 10 }, // only top 10
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
                inTop10: boolean;
                selectionPoints: number;
                positionPoints: number;
                points: number;
            }> = [];

            // Only consider user's top 10 predictions
            const top10Votes = userVotes.filter(v => {
                const pos = parseInt(v.raceRound.split("-")[3]);
                return pos >= 1 && pos <= 10;
            });

            for (const vote of top10Votes) {
                const parts = vote.raceRound.split("-");
                const predictedPos = parseInt(parts[3]); // 1-based
                const actualIndex = top10Results.indexOf(vote.driverId);
                const inTop10 = actualIndex !== -1;
                const actualPos = inTop10 ? actualIndex + 1 : null; // 1-based or null

                let selectionPoints = 0;
                let positionPoints = 0;

                if (inTop10 && actualPos !== null) {
                    // +1 for being in the actual top 10
                    selectionPoints = 1;
                    // Position accuracy bonus
                    const diff = Math.abs(predictedPos - actualPos);
                    positionPoints = calculatePositionBonus(diff);

                    if (diff === 0) {
                        perfectPredictions++;
                    }
                }

                const points = selectionPoints + positionPoints;
                totalPoints += points;

                details.push({
                    driverId: vote.driverId,
                    predictedPos,
                    actualPos,
                    inTop10,
                    selectionPoints,
                    positionPoints,
                    points,
                });
            }

            // ── Bonuses ──
            let bonusP1 = 0;
            let bonusPodium = 0;

            // Perfect P1 bonus: +3
            const p1Vote = details.find(d => d.predictedPos === 1);
            if (p1Vote && p1Vote.actualPos === 1) {
                bonusP1 = 3;
                totalPoints += bonusP1;
            }

            // Perfect podium bonus: +5 (P1, P2, P3 all exactly correct)
            const p1 = details.find(d => d.predictedPos === 1 && d.actualPos === 1);
            const p2 = details.find(d => d.predictedPos === 2 && d.actualPos === 2);
            const p3 = details.find(d => d.predictedPos === 3 && d.actualPos === 3);
            if (p1 && p2 && p3) {
                bonusPodium = 5;
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
                        userId_raceRound: { userId, raceRound: round },
                    },
                    update: {
                        totalPoints,
                        perfectPredictions,
                        details: JSON.parse(JSON.stringify(detailsWithBonuses)),
                    },
                    create: {
                        userId,
                        raceRound: round,
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
 * Reopen a race (undo finish)
 */
export async function reopenRace(round: number) {
    await requireAdmin();

    try {
        // Delete all computed scores for this race
        await prisma.raceScore.deleteMany({
            where: { raceRound: round },
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
        revalidatePath("/calendar");

        return { success: true };
    } catch (e: unknown) {
        return { error: (e instanceof Error ? e.message : String(e)) || "Błąd cofania zakończenia wyścigu" };
    }
}

/**
 * Get race data with results and scores
 */
export async function getRaceWithResults(round: number) {
    const race = await prisma.race.findUnique({
        where: { round },
        include: {
            scores: {
                where: {
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
            totalPoints: true,
        },
    });

    return scores;
}

