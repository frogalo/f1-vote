"use server";

import { prisma } from "@/lib/prisma";

export async function getLeaderboardUsers() {
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
            _count: {
                select: {
                    votes: true,
                    seasonVotes: true
                }
            },
        },
        orderBy: { name: "asc" },
    });

    // Check how many races are completed
    const completedRaces = await prisma.race.count({
        where: { completed: true },
    });

    return users.map(u => {
        const totalPoints = u.raceScores.reduce((sum, s) => sum + s.totalPoints, 0);
        const perfectPredictions = u.raceScores.reduce((sum, s) => sum + s.perfectPredictions, 0);

        return {
            id: u.id,
            name: u.name || "Anonim",
            team: u.team?.name || "Brak zespołu",
            avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=E60000&color=fff&bold=true`,
            voteCount: u._count.votes + u._count.seasonVotes,
            totalPoints,
            perfectPredictions,
            racesScored: u.raceScores.length,
            hasScores: completedRaces > 0,
        };
    });
}
