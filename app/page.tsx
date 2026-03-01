import { Metadata, ResolvingMetadata } from "next";
import { prisma } from "@/lib/prisma";
import LandingClient from "./LandingClient";

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ invite?: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await searchParams;
  const inviteRound = params.invite ? Number(params.invite) : null;

  if (inviteRound) {
    const race = await prisma.race.findUnique({ where: { round: inviteRound } });
    if (race) {
      const raceName = race.name.replace(" Grand Prix", "");
      const title = `F1 ${raceName} - Dołącz do typowania!`;
      const description = `Twój znajomy zaprasza Cię do wspólnego typowania wyników na najbliższe GP ${race.location}. Zaloguj się lub załóż darmowe konto by zagrać!`;
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: "website",
          siteName: "F1 Typy 2026",
          url: `/?invite=${inviteRound}`,
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
        }
      };
    }
  }

  // Fallback to layout.tsx generic metadata
  return {};
}

export default function LandingPage() {
    return <LandingClient />;
}
