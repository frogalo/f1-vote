import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/index.js";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const friends = [
    { id: "user-jakub", name: "Jakub", team: "Red Bull Racing", avatar: "https://i.pravatar.cc/150?u=jakub" },
    { id: "user-agata", name: "Agata", team: "Ferrari", avatar: "https://i.pravatar.cc/150?u=agata" },
    { id: "user-kasia", name: "Kasia", team: "Mercedes", avatar: "https://i.pravatar.cc/150?u=kasia" },
    { id: "user-wiktoria", name: "Wiktoria", team: "McLaren", avatar: "https://i.pravatar.cc/150?u=wiktoria" },
    { id: "user-iga", name: "Iga", team: "Aston Martin", avatar: "https://i.pravatar.cc/150?u=iga" },
    { id: "user-rafal", name: "Rafał", team: "Alpine", avatar: "https://i.pravatar.cc/150?u=rafal" },
];

const drivers = [
  "ver", "per", "lec", "ham", "rus", "ant", "nor", "pia", "alo", "str", "gas", "col", "bea", "oco", "alb", "sai", "law", "lin", "hul", "bor", "bot", "had"
];

async function main() {
  console.log("Start seeding ...");
  
  // Clean up existing data manually to ensure fresh start
  try {
    await prisma.vote.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log("Database might be empty, continuing...");
  }

  // Create Users
  for (const friend of friends) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    await prisma.user.create({
      data: {
        id: friend.id,
        username: friend.name.toLowerCase(),
        password: hashedPassword,
        name: friend.name,
        team: friend.team,
        avatar: friend.avatar,
      },
    });
    console.log(`Created user: ${friend.name} (${friend.id})`);
  }

  // Create Mock Votes
  // For each user, generate some random votes
  const votes = [];
  const baseTime = Date.now() - 30 * 24 * 60 * 60 * 1000;

  for (const friend of friends) {
    // Season Predictions (Top 10)
    const shuffledDrivers = [...drivers].sort(() => 0.5 - Math.random());
    for (let i = 0; i < 10; i++) {
        votes.push({
            id: nanoid(),
            userId: friend.id,
            driverId: shuffledDrivers[i],
            raceRound: `season-position-${i + 1}`,
            createdAt: new Date(baseTime + Math.random() * 1000000),
        });
    }

    // Race Predictions (Round 1-5)
    for (let round = 1; round <= 5; round++) {
        const raceShuffled = [...drivers].sort(() => 0.5 - Math.random());
        for (let pos = 1; pos <= 22; pos++) { // Predict full grid? usually top 10?
             // Assuming full grid based on previous code usage
             votes.push({
                id: nanoid(),
                userId: friend.id,
                driverId: raceShuffled[pos - 1],
                raceRound: `race-${round}-position-${pos}`,
                createdAt: new Date(baseTime + round * 24 * 60 * 60 * 1000 + Math.random() * 1000000),
            });
        }
    }
  }

  console.log(`Generated ${votes.length} mock votes.`);

  if (votes.length > 0) {
    // Prisma generateMany chunks automatically? Use chunks of 1000 just in case
    const chunkSize = 500;
    for (let i = 0; i < votes.length; i += chunkSize) {
        const chunk = votes.slice(i, i + chunkSize);
        await prisma.vote.createMany({
            data: chunk.map(v => ({
                userId: v.userId,
                driverId: v.driverId,
                raceRound: v.raceRound,
                createdAt: v.createdAt
            }))
        });
    }
    console.log(`Inserted all votes.`);
  }
  
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
