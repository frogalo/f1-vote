"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, RotateCcw, Trophy, ArrowRightLeft, Undo2 } from "lucide-react";
import { clsx } from "clsx";
import { getActiveDriversForResults, finishRace, reopenRace, finishSprint, reopenSprint } from "@/app/actions/raceResults";
import { saveRaceExtras, getRaceExtras } from "@/app/actions/raceExtras";
import { toast } from "sonner";
import { getTeamLogo, normalizeCountryCode } from "@/lib/data";
import ReactCountryFlag from "react-country-flag";

type DriverOption = {
    slug: string;
    name: string;
    number: number;
    team: string;
    color: string;
    country: string;
};

type Race = {
    id: string;
    round: number;
    name: string;
    location: string;
    date: string | Date;
    completed?: boolean;
    results?: string[];
    hasSprint?: boolean;
    sprintCompleted?: boolean;
    sprintResults?: string[];
    finishTarget?: 'race' | 'sprint';
};

type Props = {
    race: Race;
    onClose: () => void;
    onFinished: () => void;
};

export default function FinishRaceModal({ race, onClose, onFinished }: Props) {
    const [allDrivers, setAllDrivers] = useState<DriverOption[]>([]);
    const [pickedOrder, setPickedOrder] = useState<DriverOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Swap mode: click two drivers in the picked list to swap them
    const [swapFirst, setSwapFirst] = useState<number | null>(null);

    // Extra race data (only for race, not sprint)
    const [extraDotd, setExtraDotd] = useState<string>("");
    const [extraDnfCount, setExtraDnfCount] = useState<string>("");
    const [extraFastestLap, setExtraFastestLap] = useState<string>("");
    const [extraStartCollision, setExtraStartCollision] = useState<string>("");

    useEffect(() => {
        async function loadDrivers() {
            try {
                const data = await getActiveDriversForResults();
                setAllDrivers(data);

                // If race already has results, pre-fill the picked order
                const isSprint = race.finishTarget === 'sprint';
                const currentResults = isSprint ? race.sprintResults : race.results;
                if (currentResults && currentResults.length > 0) {
                    const ordered: DriverOption[] = [];
                    for (const slug of currentResults) {
                        const d = data.find(dr => dr.slug === slug);
                        if (d) ordered.push(d);
                    }
                    setPickedOrder(ordered);
                }
            } catch {
                toast.error("Błąd ładowania kierowców");
            } finally {
                setLoading(false);
            }
        }

        async function loadExtras() {
            if (race.finishTarget !== 'sprint') {
                try {
                    const extras = await getRaceExtras(race.round);
                    if (extras) {
                        setExtraDotd(extras.actualDotd || "");
                        setExtraDnfCount(extras.actualDnfCount !== null ? String(extras.actualDnfCount) : "");
                        setExtraFastestLap(extras.actualFastestLap || "");
                        setExtraStartCollision(extras.actualStartCollision !== null ? String(extras.actualStartCollision) : "");
                    }
                } catch { /* ignore */ }
            }
        }

        loadDrivers();
        loadExtras();
    }, [race.results, race.round, race.finishTarget]);

    // Drivers not yet picked
    const remainingDrivers = allDrivers.filter(
        d => !pickedOrder.find(p => p.slug === d.slug)
    );

    const allPicked = remainingDrivers.length === 0 && pickedOrder.length > 0;

    const isSprint = race.finishTarget === 'sprint';
    const isCompleted = isSprint ? race.sprintCompleted : race.completed;

    // Pick a driver — adds them to the next position
    function pickDriver(driver: DriverOption) {
        if (isCompleted) return;
        setPickedOrder(prev => [...prev, driver]);
    }

    // Click on a picked driver — either start swap or complete swap
    function handlePickedClick(index: number) {
        if (isCompleted) return;

        if (swapFirst === null) {
            // Start swap — select first driver
            setSwapFirst(index);
        } else if (swapFirst === index) {
            // Clicked same driver — cancel swap
            setSwapFirst(null);
        } else {
            // Complete swap
            setPickedOrder(prev => {
                const newOrder = [...prev];
                [newOrder[swapFirst], newOrder[index]] = [newOrder[index], newOrder[swapFirst]];
                return newOrder;
            });
            setSwapFirst(null);
        }
    }

    // Undo last pick
    function undoLast() {
        setPickedOrder(prev => prev.slice(0, -1));
        setSwapFirst(null);
    }

    // Reset all picks
    function resetAll() {
        setPickedOrder([]);
        setSwapFirst(null);
    }

    async function handleFinish() {
        if (!allPicked) {
            toast.error("Musisz ustawić kolejność wszystkich kierowców");
            return;
        }

        const typeName = isSprint ? "sprint" : "wyścig";

        if (!confirm(`Zakończyć ${typeName} "${race.name}"? Zostaną obliczone punkty dla wszystkich użytkowników.`)) return;

        setSubmitting(true);
        try {
            const results = pickedOrder.map(d => d.slug);

            // Save extras before finishing (race only)
            if (!isSprint) {
                await saveRaceExtras(race.round, {
                    actualDotd: extraDotd || null,
                    actualDnfCount: extraDnfCount ? parseInt(extraDnfCount) : null,
                    actualFastestLap: extraFastestLap || null,
                    actualStartCollision: extraStartCollision ? extraStartCollision === "true" : null,
                });
            }

            const result = isSprint 
                ? await finishSprint(race.round, results)
                : await finishRace(race.round, results);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`🏁 ${isSprint ? 'Sprint' : 'Wyścig'} zakończony! Obliczono punkty dla ${result.usersScored} użytkowników.`);
                onFinished();
            }
        } catch {
            toast.error("Błąd zakańczania wyścigu");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleReopen() {
        const typeName = isSprint ? "sprintu" : "wyścigu";
        if (!confirm(`Cofnąć zakończenie ${typeName} "${race.name}"? Punkty zostaną usunięte.`)) return;

        setSubmitting(true);
        try {
            const result = isSprint 
                ? await reopenSprint(race.round)
                : await reopenRace(race.round);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`${isSprint ? 'Sprint' : 'Wyścig'} ponownie otwarty`);
                onFinished();
            }
        } catch {
            toast.error("Błąd cofania");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">
                            {isCompleted ? "Wyniki" : "Zakończ"} <span className="text-[#E60000]">{isSprint ? "Sprint" : "Wyścig"}</span>
                        </h2>
                        <p className="text-gray-500 text-xs mt-0.5">
                            Runda {race.round} · {race.name}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#E60000]"></div>
                        </div>
                    ) : (
                        <>
                            {/* ── PICKED ORDER ── */}
                            {pickedOrder.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-1.5">
                                            <Trophy className="w-3 h-3 text-[#E60000]" />
                                            Kolejność ({pickedOrder.length}/{allDrivers.length})
                                        </h3>
                                        {!isCompleted && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={undoLast}
                                                    className="text-[10px] px-2 py-1 bg-[#2C2C2E] hover:bg-white/10 text-gray-400 rounded-lg border border-white/5 flex items-center gap-1 transition-colors"
                                                >
                                                    <Undo2 className="w-3 h-3" /> Cofnij
                                                </button>
                                                <button
                                                    onClick={resetAll}
                                                    className="text-[10px] px-2 py-1 bg-[#2C2C2E] hover:bg-red-900/30 text-gray-400 hover:text-red-400 rounded-lg border border-white/5 transition-colors"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {swapFirst !== null && (
                                        <div className="text-xs text-[#E60000] bg-[#E60000]/10 border border-[#E60000]/20 rounded-lg px-3 py-2 mb-2 flex items-center gap-2 font-bold">
                                            <ArrowRightLeft className="w-3.5 h-3.5" />
                                            Kliknij drugiego kierowcę aby zamienić z P{swapFirst + 1}
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        {pickedOrder.map((driver, index) => (
                                            <button
                                                key={driver.slug}
                                                onClick={() => handlePickedClick(index)}
                                                disabled={isCompleted}
                                                className={clsx(
                                                    "w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left",
                                                    swapFirst === index
                                                        ? "border-[#E60000] bg-[#E60000]/15 ring-1 ring-[#E60000]/50"
                                                        : swapFirst !== null
                                                            ? "border-white/10 bg-[#2C2C2E]/70 hover:border-[#E60000]/50 hover:bg-[#E60000]/5 cursor-pointer"
                                                            : "border-white/5 bg-[#2C2C2E]/50 hover:bg-[#2C2C2E] cursor-pointer",
                                                    isCompleted && "cursor-default",
                                                    index === 0 && "border-[#E60000]/30 bg-gradient-to-r from-[#E60000]/10 to-transparent",
                                                    index === 0 && swapFirst === index && "border-[#E60000] bg-[#E60000]/20"
                                                )}
                                            >
                                                {/* Position badge */}
                                                <div className={clsx(
                                                    "w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0",
                                                    index === 0 ? "bg-[#E60000] text-white" :
                                                    index === 1 ? "bg-gray-500 text-white" :
                                                    index === 2 ? "bg-orange-700 text-white" :
                                                    "bg-[#3C3C3E] text-gray-400"
                                                )}>
                                                    {index === 0 ? <Trophy className="w-3.5 h-3.5" /> : `P${index + 1}`}
                                                </div>

                                                {/* Driver info */}
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <div className="w-6 h-6 rounded bg-[#3C3C3E] flex items-center justify-center font-bold text-[9px] text-white shrink-0">
                                                        {driver.number}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-white text-sm truncate flex items-center gap-1">
                                                            {driver.country && (
                                                                <ReactCountryFlag 
                                                                    countryCode={normalizeCountryCode(driver.country)} 
                                                                    svg 
                                                                    style={{ width: "1.2em", height: "1.2em", borderRadius: "50%", objectFit: "cover" }} 
                                                                    aria-label={driver.country} 
                                                                />)}
                                                            {driver.name}
                                                        </div>
                                                        <div className="text-[9px] text-gray-500 uppercase tracking-wider">{driver.team}</div>
                                                    </div>
                                                </div>

                                                {/* Swap indicator */}
                                                {!isCompleted && swapFirst !== null && swapFirst !== index && (
                                                    <ArrowRightLeft className="w-3.5 h-3.5 text-[#E60000] shrink-0" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── EXTRA RACE DATA (race only, not sprint) ── */}
                            {!isSprint && allPicked && (
                                <div className="space-y-3">
                                    <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-1.5">
                                        ⚡ Dodatkowe dane wyścigu
                                    </h3>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">Driver of the Day</label>
                                            <select
                                                value={extraDotd}
                                                onChange={(e) => setExtraDotd(e.target.value)}
                                                className="w-full bg-[#2C2C2E] border border-white/10 p-2.5 rounded-xl text-white text-sm font-medium focus:border-[#E60000] outline-none transition-colors appearance-none"
                                            >
                                                <option value="">Wybierz...</option>
                                                {allDrivers.map(d => (
                                                    <option key={d.slug} value={d.slug}>{d.name} ({d.team})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">Liczba DNF</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="20"
                                                value={extraDnfCount}
                                                onChange={(e) => setExtraDnfCount(e.target.value)}
                                                placeholder="0"
                                                className="w-full bg-[#2C2C2E] border border-white/10 p-2.5 rounded-xl text-white text-sm font-medium focus:border-[#E60000] outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">Najszybsze okrążenie (kierowca)</label>
                                            <select
                                                value={extraFastestLap}
                                                onChange={(e) => setExtraFastestLap(e.target.value)}
                                                className="w-full bg-[#2C2C2E] border border-white/10 p-2.5 rounded-xl text-white text-sm font-medium focus:border-[#E60000] outline-none transition-colors appearance-none"
                                            >
                                                <option value="">Wybierz...</option>
                                                {allDrivers.map(d => (
                                                    <option key={d.slug} value={d.slug}>{d.name} ({d.team})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">Kolizja na starcie?</label>
                                            <select
                                                value={extraStartCollision}
                                                onChange={(e) => setExtraStartCollision(e.target.value)}
                                                className="w-full bg-[#2C2C2E] border border-white/10 p-2.5 rounded-xl text-white text-sm font-medium focus:border-[#E60000] outline-none transition-colors appearance-none"
                                            >
                                                <option value="">Wybierz...</option>
                                                <option value="true">Tak</option>
                                                <option value="false">Nie</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── REMAINING DRIVERS TO PICK ── */}
                            {!isCompleted && remainingDrivers.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">
                                        {pickedOrder.length === 0
                                            ? "Kliknij kierowcę aby ustawić P1, P2, P3…"
                                            : `Wybierz P${pickedOrder.length + 1}`}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {remainingDrivers.map(driver => (
                                            <button
                                                key={driver.slug}
                                                onClick={() => pickDriver(driver)}
                                                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#2C2C2E] border border-white/5 hover:border-[#E60000]/40 hover:bg-[#E60000]/5 transition-all text-left group"
                                            >
                                                <div className="w-6 h-6 rounded bg-[#3C3C3E] flex items-center justify-center font-bold text-[9px] text-white shrink-0 group-hover:bg-[#E60000]/20">
                                                    {driver.number}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-white text-xs truncate flex items-center gap-1">
                                                        {driver.country && (
                                                            <ReactCountryFlag 
                                                                countryCode={normalizeCountryCode(driver.country)} 
                                                                svg 
                                                                style={{ width: "1.2em", height: "1.2em", borderRadius: "50%", objectFit: "cover" }} 
                                                                aria-label={driver.country} 
                                                            />)}
                                                        {driver.name}
                                                    </div>
                                                    <div className="text-[8px] text-gray-600 uppercase tracking-wider">{driver.team}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* All picked message */}
                            {allPicked && !isCompleted && (
                                <div className="text-center text-xs text-green-400 bg-green-900/20 border border-green-500/20 rounded-xl py-3 font-bold">
                                    ✅ Wszyscy kierowcy ustawieni — kliknij dwóch aby zamienić lub zatwierdź
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer actions */}
                <div className="p-4 border-t border-white/5 shrink-0 space-y-2">
                    {isCompleted ? (
                        <div className="space-y-2">
                            <button
                                onClick={async () => {
                                    setSubmitting(true);
                                    try {
                                        // Save extras before recalculating (race only)
                                        if (!isSprint) {
                                            await saveRaceExtras(race.round, {
                                                actualDotd: extraDotd || null,
                                                actualDnfCount: extraDnfCount ? parseInt(extraDnfCount) : null,
                                                actualFastestLap: extraFastestLap || null,
                                                actualStartCollision: extraStartCollision ? extraStartCollision === "true" : null,
                                            });
                                        }
                                        const results = pickedOrder.map(d => d.slug);
                                        const result = isSprint 
                                            ? await finishSprint(race.round, results)
                                            : await finishRace(race.round, results);
                                        if (result.error) {
                                            toast.error(result.error);
                                        } else {
                                            toast.success(`🔄 Przeliczono punkty dla ${result.usersScored} użytkowników.`);
                                            onFinished();
                                        }
                                    } catch {
                                        toast.error("Błąd przeliczania");
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                                disabled={submitting}
                                className={clsx(
                                    "w-full flex items-center justify-center gap-2 p-4 bg-[#E60000] hover:bg-red-700 rounded-xl font-black uppercase tracking-wider text-white transition-all active:scale-[0.98] shadow-lg shadow-red-900/20",
                                    submitting && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <RotateCcw className="w-5 h-5" />
                                {submitting ? "Obliczanie..." : "🔄 Przelicz Punkty Ponownie"}
                            </button>
                            <button
                                onClick={handleReopen}
                                disabled={submitting}
                                className={clsx(
                                    "w-full flex items-center justify-center gap-2 p-3 bg-[#2C2C2E] hover:bg-orange-900/30 rounded-xl font-bold uppercase tracking-wider text-gray-400 hover:text-orange-400 transition-all text-sm border border-white/5",
                                    submitting && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <RotateCcw className="w-4 h-4" />
                                {submitting ? "Cofanie..." : "Cofnij Zakończenie"}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleFinish}
                            disabled={submitting || loading || !allPicked}
                            className={clsx(
                                "w-full flex items-center justify-center gap-2 p-4 bg-[#E60000] hover:bg-red-700 rounded-xl font-black uppercase tracking-wider text-white transition-all active:scale-[0.98] shadow-lg shadow-red-900/20",
                                (submitting || loading || !allPicked) && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            {submitting ? "Obliczanie punktów..." : `🏁 Zakończ ${isSprint ? 'Sprint' : 'Wyścig'} i Oblicz Punkty`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
