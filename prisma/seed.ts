import { PrismaClient } from "../src/generated/prisma";
import { friends, generateMockVotes } from "../lib/mockData";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");
  
  // Clean up existing data
  await prisma.vote.deleteMany();
  await prisma.user.deleteMany();

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
  const votes = generateMockVotes();
  console.log(`Generated ${votes.length} mock votes.`);

  // We need to batch insert votes for performance
  // Prisma createMany is supported in Postgres
  
  // Filter votes to only include those for users we just created
  // Although we created all friends, let's be safe.
  const validUserIds = new Set(friends.map(f => f.id));
  const validVotes = votes.filter(v => validUserIds.has(v.userId));

  if (validVotes.length > 0) {
    await prisma.vote.createMany({
      data: validVotes.map(v => ({
        userId: v.userId,
        driverId: v.driverId,
        raceRound: String(v.raceRound),
        createdAt: new Date(v.createdAt),
      })),
    });
    console.log(`Inserted ${validVotes.length} votes.`);
  }

  // Also seed Jakub's votes which are separate?
  // In mockData.ts, generateMockVotes() includes all friends' votes?
  // Let's check mockData.ts
  // export function generateMockVotes(): Vote[] {
  //     return friends.flatMap(friend => getVotesForUser(friend.id));
  // }
  // So yes, it includes Jakub (user-jakub is in friends array).
  
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
