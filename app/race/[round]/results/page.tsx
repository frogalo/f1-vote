import { Suspense } from "react";
import RaceResultsContent from "./RaceResultsContent";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
    try {
        const races = await prisma.race.findMany({ select: { round: true } });
        return races.map((r) => ({
            round: r.round.toString(),
        }));
    } catch (error) {
        console.warn("Could not fetch races for static generation. Building pages dynamically instead.");
        return [];
    }
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
