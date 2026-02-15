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

    if (!slug || !name || !number || !teamId) {
        return { error: "Brakuje wymaganych pól (slug, name, number, teamId)" };
    }

    // Check if slug already exists
    const existing = await prisma.driver.findUnique({ where: { slug } });
    if (existing) {
        return { error: `Kierowca o slug "${slug}" już istnieje` };
    }

    const driver = await prisma.driver.create({
        data: { slug, name, number, country: country || null, teamId, color: color || null },
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

    if (!slug || !name || !number || !teamId) {
        return { error: "Brakuje wymaganych pól" };
    }

    const driver = await prisma.driver.update({
        where: { slug },
        data: { name, number, country: country || null, teamId, color: color || null },
        include: { team: { select: { name: true } } },
    });

    return { success: true, driver };
}

export async function deleteDriver(slug: string) {
    await requireAdmin();

    // Delete related votes first
    await prisma.vote.deleteMany({ where: { driverId: slug } });
    // Remove favorite references
    await prisma.user.updateMany({
        where: { favoriteDriverId: slug },
        data: { favoriteDriverId: null },
    });

    await prisma.driver.delete({ where: { slug } });

    return { success: true };
}
