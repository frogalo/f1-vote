"use server";

import { prisma } from "@/lib/prisma";

export async function getProfileOptions() {
    const [teams, drivers] = await Promise.all([
        prisma.team.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true },
        }),
        prisma.driver.findMany({
            orderBy: { name: "asc" },
            select: { slug: true, name: true, number: true, team: { select: { name: true } } },
        }),
    ]);

    return { teams, drivers };
}
