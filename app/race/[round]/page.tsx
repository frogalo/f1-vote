import { VoteComponent } from "./VoteComponent";
import { prisma } from "@/lib/prisma";
import { Metadata, ResolvingMetadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ round: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { round: roundStr } = await params;
  const round = Number(roundStr);
  const race = await prisma.race.findUnique({ where: { round } });

  if (!race) {
    return { title: "Wyścig F1" };
  }

  const raceName = race.name.replace(" Grand Prix", "");
  const title = `F1 ${raceName} - Typuj wyniki!`;
  const description = `Czas na GP ${race.location}. Zaloguj się. Wejdź i podaj swoich faworytów!`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://f1.jakub-urbanski.me";
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/race/${round}`,
      type: "website",
      siteName: "F1 Typy 2026",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ round: string }> }) {
  const { round: roundStr } = await params;
  const round = Number(roundStr);
  
  const race = await prisma.race.findUnique({ where: { round } });
  const drivers = await prisma.driver.findMany({
    where: { active: true },
    orderBy: { team: { name: "asc" } }, // or whatever order
    include: { team: { select: { name: true } } }
  });

  if (!race) notFound();

  // Map Prisma drivers to Component drivers
  const mappedDrivers = drivers.map(d => ({
    id: d.slug,
    name: d.name,
    number: d.number,
    team: d.team.name,
    color: d.color || "bg-gray-500",
    country: d.country || "XX",
    active: d.active
  }));

  // Serialize race date for client component
  const serializedRace = {
    ...race,
    date: race.date.toISOString(),
    circuitId: race.circuitId || undefined,
    url: race.url || undefined,
    country: race.country || undefined,
    trackImage: race.trackImage || undefined,
    isTesting: race.isTesting || undefined
  };

  return <VoteComponent race={serializedRace} drivers={mappedDrivers} />;
}
