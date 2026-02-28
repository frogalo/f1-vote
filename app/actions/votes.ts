"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

/**
 * Save race votes to the database.
 * Called from the client whenever the user reorders drivers for a race.
 */
export async function saveRaceVotes(
    round: number,
    driverIds: string[]
) {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) return { error: "Nie zalogowano" };

    try {
        // Delete existing race votes for this user + round
        await prisma.vote.deleteMany({
            where: {
                userId,
                raceRound: { startsWith: `race-${round}-position-` },
            },
        });

        // Create new votes (only top 10 positions needed for scoring, but save all for display)
        const votesToCreate = driverIds.map((driverId, index) => ({
            userId,
            driverId,
            raceRound: `race-${round}-position-${index + 1}`,
        }));

        await prisma.vote.createMany({
            data: votesToCreate,
        });

        return { success: true };
    } catch (e: unknown) {
        console.error("Error saving race votes:", e);
        return { error: (e instanceof Error ? e.message : String(e)) };
    }
}

/**
 * Get the voting status (has voted / has not voted) for all active users for a given race round.
 * Excludes admin/test accounts.
 */
export async function getRaceVoterStatus(round: number) {
    try {
        const users = await prisma.user.findMany({
            where: {
                isAdmin: false,
                username: { not: "testadmin" },
                name: { not: "testadmin" },
            },
            select: {
                id: true,
                name: true,
                avatar: true,
                team: { select: { name: true } }
            },
            orderBy: { name: "asc" }
        });

        // Get users who have at least one vote for this round
        const votedUserIds = await prisma.vote.groupBy({
            by: ['userId'],
            where: {
                raceRound: { startsWith: `race-${round}-position-` }
            }
        });

        const votedIdsSet = new Set(votedUserIds.map(v => v.userId));

        return users.map(u => ({
            id: u.id,
            name: u.name,
            avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=E60000&color=fff&bold=true`,
            team: u.team?.name,
            hasVoted: votedIdsSet.has(u.id)
        }));
    } catch (e) {
        console.error("Error fetching voter status:", e);
        return [];
    }
}
