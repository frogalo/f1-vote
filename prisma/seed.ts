import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const connectionString = process.env.POSTGRES_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// All F1 2026 teams with their colors
const teamsData = [
  { name: "Alpine", color: "bg-pink-500 border-blue-600" },
  { name: "Aston Martin", color: "bg-emerald-700 border-lime-400" },
  { name: "Williams", color: "bg-blue-800 border-blue-400" },
  { name: "Audi", color: "bg-red-700 border-white" },
  { name: "Cadillac", color: "bg-slate-700 border-yellow-500" },
  { name: "Ferrari", color: "bg-red-600 border-yellow-400" },
  { name: "Haas", color: "bg-slate-100 border-red-600 text-black" },
  { name: "McLaren", color: "bg-orange-500 border-black" },
  { name: "Mercedes", color: "bg-slate-300 border-cyan-400 text-black" },
  { name: "Racing Bulls", color: "bg-blue-600 border-white" },
  { name: "Red Bull Racing", color: "bg-blue-900 border-red-600" },
];

// All F1 2026 drivers with their team assignments
const driversData = [
  { slug: "gas", name: "Pierre Gasly", number: 43, country: "🇫🇷", team: "Alpine", color: "bg-pink-500 border-blue-600" },
  { slug: "col", name: "Franco Colapinto", number: 10, country: "🇦🇷", team: "Alpine", color: "bg-pink-500 border-blue-600" },
  { slug: "alo", name: "Fernando Alonso", number: 14, country: "🇪🇸", team: "Aston Martin", color: "bg-emerald-700 border-lime-400" },
  { slug: "str", name: "Lance Stroll", number: 18, country: "🇨🇦", team: "Aston Martin", color: "bg-emerald-700 border-lime-400" },
  { slug: "alb", name: "Alexander Albon", number: 23, country: "🇹🇭", team: "Williams", color: "bg-blue-800 border-blue-400" },
  { slug: "sai", name: "Carlos Sainz Jr.", number: 55, country: "🇪🇸", team: "Williams", color: "bg-blue-800 border-blue-400" },
  { slug: "bor", name: "Gabriel Bortoleto", number: 5, country: "🇧🇷", team: "Audi", color: "bg-red-700 border-white" },
  { slug: "hul", name: "Nico Hülkenberg", number: 27, country: "🇩🇪", team: "Audi", color: "bg-red-700 border-white" },
  { slug: "per", name: "Sergio Pérez", number: 11, country: "🇲🇽", team: "Cadillac", color: "bg-slate-700 border-yellow-500" },
  { slug: "bot", name: "Valtteri Bottas", number: 77, country: "🇫🇮", team: "Cadillac", color: "bg-slate-700 border-yellow-500" },
  { slug: "lec", name: "Charles Leclerc", number: 16, country: "🇲🇨", team: "Ferrari", color: "bg-red-600 border-yellow-400" },
  { slug: "ham", name: "Lewis Hamilton", number: 44, country: "🇬🇧", team: "Ferrari", color: "bg-red-600 border-yellow-400" },
  { slug: "oco", name: "Esteban Ocon", number: 31, country: "🇫🇷", team: "Haas", color: "bg-slate-100 border-red-600 text-black" },
  { slug: "bea", name: "Oliver Bearman", number: 87, country: "🇬🇧", team: "Haas", color: "bg-slate-100 border-red-600 text-black" },
  { slug: "nor", name: "Lando Norris", number: 1, country: "🇬🇧", team: "McLaren", color: "bg-orange-500 border-black" },
  { slug: "pia", name: "Oscar Piastri", number: 81, country: "🇦🇺", team: "McLaren", color: "bg-orange-500 border-black" },
  { slug: "ant", name: "Kimi Antonelli", number: 12, country: "🇮🇹", team: "Mercedes", color: "bg-slate-300 border-cyan-400 text-black" },
  { slug: "rus", name: "George Russell", number: 63, country: "🇬🇧", team: "Mercedes", color: "bg-slate-300 border-cyan-400 text-black" },
  { slug: "law", name: "Liam Lawson", number: 30, country: "🇳🇿", team: "Racing Bulls", color: "bg-blue-600 border-white" },
  { slug: "lin", name: "Arvid Lindblad", number: 41, country: "🇬🇧", team: "Racing Bulls", color: "bg-blue-600 border-white" },
  { slug: "ver", name: "Max Verstappen", number: 3, country: "🇳🇱", team: "Red Bull Racing", color: "bg-blue-900 border-red-600" },
  { slug: "had", name: "Isack Hadjar", number: 6, country: "🇫🇷", team: "Red Bull Racing", color: "bg-blue-900 border-red-600" },
];

async function main() {
  console.log("🏁 Seeding F1 Vote 2026 database...\n");

  // 1. Upsert teams
  console.log("📦 Seeding teams...");
  const teamMap: Record<string, string> = {};
  for (const t of teamsData) {
    const team = await prisma.team.upsert({
      where: { name: t.name },
      update: { color: t.color },
      create: { name: t.name, color: t.color },
    });
    teamMap[t.name] = team.id;
    console.log(`  ✅ ${t.name}`);
  }

  // 2. Upsert drivers
  console.log("\n🏎️  Seeding drivers...");
  for (const d of driversData) {
    const teamId = teamMap[d.team];
    if (!teamId) {
      console.error(`  ❌ Team "${d.team}" not found for driver ${d.name}`);
      continue;
    }
    await prisma.driver.upsert({
      where: { slug: d.slug },
      update: { name: d.name, number: d.number, country: d.country, teamId, color: d.color },
      create: { slug: d.slug, name: d.name, number: d.number, country: d.country, teamId, color: d.color },
    });
    console.log(`  ✅ #${d.number} ${d.name} (${d.team})`);
  }

  // 3. Seed admin user
  console.log("\n👑 Seeding admin user...");
  const adminRawPassword = process.env.ADMIN_PASSWORD || "PozmionaX12!";
  const adminPassword = await bcrypt.hash(adminRawPassword, 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { isAdmin: true, password: adminPassword },
    create: {
      username: "admin",
      password: adminPassword,
      name: "Administrator",
      isAdmin: true,
    },
  });
  console.log(`  ✅ Admin user seeded (username: admin, password from ADMIN_PASSWORD env or default admin123)`);

  console.log("\n🏁 Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
