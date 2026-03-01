"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const CURRENT_SEASON = 2026;
const FIRST_RACE_DATE = new Date("2026-03-08T05:00:00Z");

async function getAuthUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("userId")?.value || null;
}

export async function isSeasonLocked(): Promise<boolean> {
    return Date.now() > FIRST_RACE_DATE.getTime();
}

export async function hasSeasonVotes(): Promise<boolean> {
    const userId = await getAuthUserId();
    if (!userId || !prisma.seasonVote) return false;

    try {
        const count = await prisma.seasonVote.count({
            where: { userId, season: CURRENT_SEASON },
        });

        return count > 0;
    } catch (e) {
        console.error("Prisma error in hasSeasonVotes:", e);
        return false;
    }
}

export async function hasCompletedSeasonPicks(): Promise<boolean> {
    const userId = await getAuthUserId();
    if (!userId || !prisma.seasonVote || !prisma.driver) return true; // fail open for unauth

    try {
        const count = await prisma.seasonVote.count({
            where: { userId, season: CURRENT_SEASON },
        });
        const total = await prisma.driver.count({
            where: { activeSeason: true },
        });

        return count >= total;
    } catch (e) {
        return true;
    }
}

export async function getSeasonVotes() {
    const userId = await getAuthUserId();
    if (!userId || !prisma.seasonVote) return [];

    try {
        const votes = await prisma.seasonVote.findMany({
            where: { userId, season: CURRENT_SEASON },
            orderBy: { position: "asc" },
            include: {
                driver: {
                    select: {
                        slug: true,
                        name: true,
                        number: true,
                        country: true,
                        color: true,
                        activeSeason: true,
                        team: { select: { name: true } },
                    },
                },
            },
        });

        // Only include drivers that still have activeSeason enabled
        const activeVotes = votes.filter(v => v.driver.activeSeason);

        return activeVotes.map((v, i) => ({
            position: i + 1, // Re-compact positions after filtering
            driverSlug: v.driver.slug,
            driverName: v.driver.name,
            driverNumber: v.driver.number,
            driverCountry: v.driver.country,
            driverColor: v.driver.color,
            team: v.driver.team.name,
        }));
    } catch (e) {
        console.error("Prisma error in getSeasonVotes:", e);
        return [];
    }
}

export async function getAvailableDrivers() {
    const drivers = await prisma.driver.findMany({
        where: { activeSeason: true },
        orderBy: { name: "asc" },
        include: { team: { select: { name: true } } },
    });

    return drivers.map(d => ({
        slug: d.slug,
        name: d.name,
        number: d.number,
        country: d.country,
        color: d.color,
        team: d.team.name,
    }));
}

// Add a single driver at the next position
export async function addSeasonVote(driverSlug: string) {
    const userId = await getAuthUserId();
    if (!userId) return { error: "Nie zalogowano" };
    if (!prisma.seasonVote) return { error: "Błąd bazy danych (brak modelu SeasonVote)" };

    if (await isSeasonLocked()) {
        return { error: "Sezon się rozpoczął — typy są zablokowane" };
    }

    try {
        // Get current max position for this user
        const lastVote = await prisma.seasonVote.findFirst({
            where: { userId, season: CURRENT_SEASON },
            orderBy: { position: "desc" },
        });

        const nextPosition = (lastVote?.position || 0) + 1;

        // Check if driver already voted
        const existing = await prisma.seasonVote.findUnique({
            where: {
                userId_driverId_season: {
                    userId,
                    driverId: driverSlug,
                    season: CURRENT_SEASON,
                },
            },
        });

        if (existing) {
            return { error: "Ten kierowca jest już w Twoim typowaniu" };
        }

        await prisma.seasonVote.create({
            data: {
                userId,
                driverId: driverSlug,
                position: nextPosition,
                season: CURRENT_SEASON,
            },
        });

        return { success: true, position: nextPosition };
    } catch (e) {
        console.error("Error in addSeasonVote:", e);
        return { error: "Błąd podczas dodawania typu" };
    }
}

// Remove a driver and re-compact positions
export async function removeSeasonVote(driverSlug: string) {
    const userId = await getAuthUserId();
    if (!userId) return { error: "Nie zalogowano" };
    if (!prisma.seasonVote) return { error: "Błąd bazy danych" };

    if (await isSeasonLocked()) {
        return { error: "Sezon się rozpoczął — typy są zablokowane" };
    }

    try {
        // Delete this driver's vote
        await prisma.seasonVote.deleteMany({
            where: { userId, driverId: driverSlug, season: CURRENT_SEASON },
        });

        // Re-compact positions
        const remaining = await prisma.seasonVote.findMany({
            where: { userId, season: CURRENT_SEASON },
            orderBy: { position: "asc" },
        });

        for (let i = 0; i < remaining.length; i++) {
            if (remaining[i].position !== i + 1) {
                await prisma.seasonVote.update({
                    where: { id: remaining[i].id },
                    data: { position: i + 1 },
                });
            }
        }

        return { success: true };
    } catch (e) {
        console.error("Error in removeSeasonVote:", e);
        return { error: "Błąd podczas usuwania typu" };
    }
}

// Reorder: accepts a full ordered list of driver slugs
export async function reorderSeasonVotes(orderedSlugs: string[]) {
    const userId = await getAuthUserId();
    if (!userId) return { error: "Nie zalogowano" };
    if (!prisma.seasonVote) return { error: "Błąd bazy danych" };

    if (await isSeasonLocked()) {
        return { error: "Sezon się rozpoczął — typy są zablokowane" };
    }

    try {
        // Delete all current votes for this season
        await prisma.seasonVote.deleteMany({
            where: { userId, season: CURRENT_SEASON },
        });

        // Re-create in new order
        await prisma.seasonVote.createMany({
            data: orderedSlugs.map((slug, index) => ({
                userId,
                driverId: slug,
                position: index + 1,
                season: CURRENT_SEASON,
            })),
        });

        return { success: true };
    } catch (e) {
        console.error("Error in reorderSeasonVotes:", e);
        return { error: "Błąd podczas zmiany kolejności" };
    }
}
