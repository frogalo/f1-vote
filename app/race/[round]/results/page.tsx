import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RaceResultsPage({ params }: { params: Promise<{ round: string }> }) {
    const { round: roundStr } = await params;
    const raceRound = Number(roundStr);

    redirect(`/race/${raceRound}?tab=race`);
}
