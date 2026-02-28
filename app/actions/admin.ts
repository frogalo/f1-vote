"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

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

export async function getTeams() {
    return prisma.team.findMany({
        orderBy: { name: "asc" },
        include: { drivers: { orderBy: { number: "asc" } } },
    });
}

export async function getDrivers() {
    return prisma.driver.findMany({
        orderBy: { name: "asc" },
        include: { team: { select: { name: true } } },
    });
}

export async function addDriver(formData: FormData) {
    await requireAdmin();

    const slug = formData.get("slug") as string;
    const name = formData.get("name") as string;
    const number = parseInt(formData.get("number") as string, 10);
    const country = formData.get("country") as string;
    const teamId = formData.get("teamId") as string;
    const color = formData.get("color") as string;
    const active = formData.get("active") === "true";
    const activeSeason = formData.get("activeSeason") === "true";

    if (!slug || !name || !number || !teamId) {
        return { error: "Brakuje wymaganych pól (slug, name, number, teamId)" };
    }

    // Check if slug already exists
    const existing = await prisma.driver.findUnique({ where: { slug } });
    if (existing) {
        return { error: `Kierowca o slug "${slug}" już istnieje` };
    }

    const driver = await prisma.driver.create({
        data: { slug, name, number, country: country || null, teamId, color: color || null, active, activeSeason },
        include: { team: { select: { name: true } } },
    });

    return { success: true, driver };
}

export async function updateDriver(formData: FormData) {
    await requireAdmin();

    const slug = formData.get("slug") as string;
    const name = formData.get("name") as string;
    const number = parseInt(formData.get("number") as string, 10);
    const country = formData.get("country") as string;
    const teamId = formData.get("teamId") as string;
    const color = formData.get("color") as string;
    const active = formData.get("active") === "true";
    const activeSeason = formData.get("activeSeason") === "true";

    if (!slug || !name || !number || !teamId) {
        return { error: "Brakuje wymaganych pól" };
    }

    const driver = await prisma.driver.update({
        where: { slug },
        data: { name, number, country: country || null, teamId, color: color || null, active, activeSeason },
        include: { team: { select: { name: true } } },
    });

    return { success: true, driver };
}

export async function toggleDriverStatus(slug: string, field: "active" | "activeSeason", value: boolean) {
    await requireAdmin();

    const driver = await prisma.driver.update({
        where: { slug },
        data: { [field]: value },
    });

    return { success: true, driver };
}

export async function deleteDriver(slug: string) {
    await requireAdmin();

    // Delete all related votes (race + season) and clean up user references
    await Promise.all([
        prisma.vote.deleteMany({ where: { driverId: slug } }),
        prisma.seasonVote.deleteMany({ where: { driverId: slug } }),
        prisma.user.updateMany({
            where: { favoriteDriverId: slug },
            data: { favoriteDriverId: null },
        }),
    ]);

    await prisma.driver.delete({ where: { slug } });

    return { success: true };
}

export async function getAllUsersWithVotes() {
    await requireAdmin();

    const users = await prisma.user.findMany({
        orderBy: { name: "asc" },
        include: {
            votes: true,
            seasonVotes: true,
            team: { select: { name: true } },
        }
    });

    return users.map(u => ({
        id: u.id,
        name: u.name,
        username: u.username,
        isAdmin: u.isAdmin,
        team: u.team?.name || "Brak",
        votesCount: u.votes.length,
        seasonVotesCount: u.seasonVotes.length,
        createdAt: u.createdAt
    }));
}

export async function deleteUser(userId: string) {
    await requireAdmin();
    try {
        await prisma.user.delete({ where: { id: userId } });
        return { success: true };
    } catch (e: unknown) {
        return { error: (e instanceof Error ? e.message : String(e)) || "Błąd usuwania użytkownika" };
    }
}

export async function getUserDetails(userId: string) {
    await requireAdmin();
    
    // Fetch user with extended vote data
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            seasonVotes: {
                orderBy: { position: "asc" },
                include: {
                    driver: { select: { slug: true, name: true, team: { select: { name: true } } } }
                }
            },
            votes: {
                orderBy: { createdAt: "desc" },
                include: {
                    driver: { select: { slug: true, name: true } }
                }
            }
        }
    });

    if (!user) return { error: "Nie znaleziono użytkownika" };

    return {
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
            seasonVotes: user.seasonVotes.map(v => ({
                position: v.position,
                driver: v.driver.name,
                team: v.driver.team.name
            })),
            raceVotes: user.votes.map(v => ({
                raceRound: v.raceRound,
                driver: v.driver.name,
                createdAt: v.createdAt
            }))
        }
    };
}
