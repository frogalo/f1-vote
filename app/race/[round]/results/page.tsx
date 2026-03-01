import { Suspense } from "react";
import RaceResultsContent from "./RaceResultsContent";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RaceResultsPage({ params }: { params: Promise<{ round: string }> }) {
    const { round: roundStr } = await params;
    const raceRound = Number(roundStr);

    return (
        <Suspense fallback={<div className="text-center p-8 text-slate-500 animate-pulse">Ładowanie wyników...</div>}>
            <RaceResultsContent raceRound={raceRound} />
        </Suspense>
    );
}
