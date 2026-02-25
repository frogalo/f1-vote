"use server";

import { prisma } from "@/lib/prisma";
import { races as seedData, Race as SeedRace } from "@/lib/data";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Admin check helper
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

export async function seedRaces() {
    await requireAdmin();
    try {
        for (const race of seedData) {
            await prisma.race.upsert({
                where: { round: race.round },
                update: {
                    name: race.name,
                    location: race.location,
                    date: new Date(race.date),
                    isTesting: race.isTesting || false,
                },
                create: {
                    round: race.round,
                    name: race.name,
                    location: race.location,
                    date: new Date(race.date),
                    isTesting: race.isTesting || false,
                },
            });
        }
        revalidatePath("/admin");
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Błąd seedowania wyścigów" };
    }
}

export async function getRaces() {
    return prisma.race.findMany({
        orderBy: { round: "asc" },
    });
}

export async function addRace(formData: FormData) {
    await requireAdmin();

    const round = parseInt(formData.get("round") as string);
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const date = formData.get("date") as string;
    const trackImage = formData.get("trackImage") as string;
    const country = formData.get("country") as string;
    const circuitId = formData.get("circuitId") as string;

    if (!round || !name || !location || !date) {
        return { error: "Brakuje wymaganych pól (Runda, Nazwa, Lokalizacja, Data)" };
    }

    try {
        const race = await prisma.race.create({
            data: {
                round,
                name,
                location,
                date: new Date(date),
                trackImage: trackImage || null,
                country: country || null,
                circuitId: circuitId || null,
            },
        });
        revalidatePath("/admin");
        revalidatePath("/calendar");
        return { success: true, race };
    } catch (e: any) {
        return { error: e.message || "Błąd dodawania wyścigu" };
    }
}

export async function updateRace(formData: FormData) {
    await requireAdmin();

    const id = formData.get("id") as string;
    const round = parseInt(formData.get("round") as string);
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const date = formData.get("date") as string;
    const trackImage = formData.get("trackImage") as string;
    const country = formData.get("country") as string;
    const circuitId = formData.get("circuitId") as string;

    if (!id || !round || !name || !location || !date) {
        return { error: "Brakuje wymaganych pól" };
    }

    try {
        const race = await prisma.race.update({
            where: { id },
            data: {
                round,
                name,
                location,
                date: new Date(date),
                trackImage: trackImage || null,
                country: country || null,
                circuitId: circuitId || null,
            },
        });
        revalidatePath("/admin");
        revalidatePath("/calendar");
        return { success: true, race };
    } catch (e: any) {
        return { error: e.message || "Błąd aktualizacji wyścigu" };
    }
}

export async function deleteRace(id: string) {
    await requireAdmin();
    try {
        await prisma.race.delete({ where: { id } });
        revalidatePath("/admin");
        revalidatePath("/calendar");
        return { success: true };
// ...existing code...
    } catch (e: any) {
        return { error: e.message || "Błąd usuwania wyścigu" };
    }
}

export async function getNextRound() {
    const races = await prisma.race.findMany({
        orderBy: { round: "asc" },
        select: { round: true, date: true }
    });
    const now = new Date();
    const nextRace = races.find(r => r.date > now);
    return nextRace?.round || races[races.length - 1]?.round || 1;
}
