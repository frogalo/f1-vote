"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

/**
 * Save or update race extra predictions for the current user.
 */
export async function saveRaceExtraVote(
    round: number,
    data: {
        dotdDriverId?: string | null;
        dnfCount?: number | null;
        fastestLapDriverId?: string | null;
        startCollision?: boolean | null;
    }
) {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) return { error: "Nie zalogowano" };

    try {
        await prisma.raceExtraVote.upsert({
            where: {
                userId_raceRound: { userId, raceRound: round },
            },
            update: {
                dotdDriverId: data.dotdDriverId,
                dnfCount: data.dnfCount,
                fastestLapDriverId: data.fastestLapDriverId,
                startCollision: data.startCollision,
            },
            create: {
                userId,
                raceRound: round,
                dotdDriverId: data.dotdDriverId,
                dnfCount: data.dnfCount,
                fastestLapDriverId: data.fastestLapDriverId,
                startCollision: data.startCollision,
            },
        });

        return { success: true };
    } catch (e: unknown) {
        console.error("Error saving race extra vote:", e);
        return { error: e instanceof Error ? e.message : String(e) };
    }
}

/**
 * Get the current user's race extra predictions for a specific round.
 */
export async function getMyRaceExtraVote(round: number) {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) return null;

    try {
        const vote = await prisma.raceExtraVote.findUnique({
            where: {
                userId_raceRound: { userId, raceRound: round },
            },
        });

        return vote;
    } catch (e) {
        console.error("Error fetching race extra vote:", e);
        return null;
    }
}

/**
 * Get race extra actual results for a specific round.
 */
export async function getRaceExtras(round: number) {
    try {
        const race = await prisma.race.findUnique({
            where: { round },
            select: {
                actualDotd: true,
                actualDnfCount: true,
                actualFastestLap: true,
                actualStartCollision: true,
            },
        });
        return race;
    } catch (e) {
        console.error("Error fetching race extras:", e);
        return null;
    }
}

/**
 * Save race extra actual results (admin only).
 */
export async function saveRaceExtras(
    round: number,
    data: {
        actualDotd?: string | null;
        actualDnfCount?: number | null;
        actualFastestLap?: string | null;
        actualStartCollision?: boolean | null;
    }
) {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) throw new Error("Nie zalogowano");

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isAdmin: true },
    });
    if (!user?.isAdmin) throw new Error("Brak uprawnień");

    try {
        await prisma.race.update({
            where: { round },
            data: {
                actualDotd: data.actualDotd,
                actualDnfCount: data.actualDnfCount,
                actualFastestLap: data.actualFastestLap,
                actualStartCollision: data.actualStartCollision,
            },
        });

        return { success: true };
    } catch (e: unknown) {
        console.error("Error saving race extras:", e);
        return { error: e instanceof Error ? e.message : String(e) };
    }
}
