"use server";

import { prisma } from "@/lib/prisma";

export async function getLeaderboardUsers() {
    const users = await prisma.user.findMany({
        where: { isAdmin: false },
        select: {
            id: true,
            name: true,
            avatar: true,
            team: { select: { name: true } },
            _count: {
                select: {
                    votes: true,
                    seasonVotes: true
                }
            },
        },
        orderBy: { name: "asc" },
    });

    return users.map(u => ({
        id: u.id,
        name: u.name || "Anonim",
        team: u.team?.name || "Brak zespołu",
        avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=E60000&color=fff&bold=true`,
        voteCount: u._count.votes + u._count.seasonVotes,
    }));
}
