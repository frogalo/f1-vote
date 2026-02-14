import { Suspense } from "react";
import RaceResultsContent from "./RaceResultsContent";
import { races } from "@/lib/data";

export async function generateStaticParams() {
    return races.map((race) => ({
        round: race.round.toString(),
    }));
}


export default async function RaceResultsPage({ params }: { params: Promise<{ round: string }> }) {
    const { round: roundStr } = await params;
    const raceRound = Number(roundStr);

    return (
        <Suspense fallback={<div className="text-center p-8 text-slate-500 animate-pulse">Ładowanie wyników...</div>}>
            <RaceResultsContent raceRound={raceRound} />
        </Suspense>
    );
}
