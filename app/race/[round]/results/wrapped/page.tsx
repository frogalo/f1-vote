import { Suspense } from "react";
import WrappedContent from "./WrappedContent";

export const dynamic = "force-dynamic";

export default async function WrappedPage({ params }: { params: Promise<{ round: string }> }) {
    const { round: roundStr } = await params;
    const raceRound = Number(roundStr);

    return (
        <Suspense fallback={
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D0D0D]">
                <div className="h-16 w-16 animate-spin rounded-full border-2 border-[#E60000]/20 border-t-[#E60000]" />
                <div className="mt-8 animate-pulse text-sm font-black uppercase tracking-[0.4em] text-[#E60000]">
                    Ładowanie...
                </div>
            </div>
        }>
            <WrappedContent raceRound={raceRound} />
        </Suspense>
    );
}
