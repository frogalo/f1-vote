import { prisma } from "../../lib/prisma";

async function main() {
    const races = await prisma.race.findMany({
        orderBy: { round: "asc" }
    });
    console.log("Races in DB:");
    for (const r of races) {
        console.log(`Round ${r.round}: ${r.name} - Date: ${r.date.toISOString()} - Completed: ${r.completed}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
