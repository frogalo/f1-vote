"use client";

import { useEffect, useState } from "react";
import { getStatsData, UserStats } from "@/app/actions/stats";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
    Trophy,
    Zap,
    Target,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    Lock,
    Sparkles,
    Medal,
    Activity,
    Info
} from "lucide-react";
import { getTeamLogo } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const VIBRANT_COLORS = [
    "#E60000", // F1 Red
    "#38BDF8", // Sky Blue
    "#A855F7", // Purple
    "#F43F5E", // Pink
    "#F59E0B", // Amber
    "#10B981", // Emerald
    "#6366F1", // Indigo
    "#14B8A6", // Teal
    "#EC4899", // Rose
    "#84CC16", // Lime
    "#F97316", // Orange
    "#06B6D4", // Cyan
];

export default function StatsPage() {
    const { user: currentUser, loading: authLoading } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState<{
        completedRacesCount: number;
        roundsLabels: string[];
        usersData: UserStats[];
        seasonLocked: boolean;
    } | null>(null);

    const [expandedUser, setExpandedUser] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (!currentUser) {
                router.push("/login");
                return;
            }
            if (currentUser.isAdmin) {
                router.push("/admin");
                return;
            }

            getStatsData()
                .then(setStatsData)
                .finally(() => setLoading(false));
        }
    }, [currentUser, authLoading, router]);

    if (loading || authLoading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-[#0D0D0D]">
                <div className="relative">
                    <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#E60000]/20 border-t-[#E60000]" />
                    <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border border-[#E60000]/10" />
                </div>
                <div className="mt-6 animate-pulse text-sm font-bold uppercase tracking-[0.3em] text-[#E60000]/80">
                    Ładowanie statystyk
                </div>
            </div>
        );
    }

    if (!statsData || statsData.usersData.length === 0) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] pb-24 font-sans text-white p-6 pt-12">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Statystyki</h1>
                <p className="mt-4 text-sm text-gray-500">Brak dostępnych statystyk.</p>
            </div>
        );
    }

    const { completedRacesCount, roundsLabels, usersData, seasonLocked } = statsData;

    // Chart Configuration
    const chartData = {
        labels: roundsLabels,
        datasets: usersData.map((u, i) => {
            const color = VIBRANT_COLORS[i % VIBRANT_COLORS.length];
            const isSelf = u.id === currentUser?.id;
            return {
                label: u.name,
                data: [0, ...u.roundProgress.map((p) => p.cumulativePoints)],
                borderColor: color,
                backgroundColor: color + "0d", // very transparent fill
                tension: 0.35,
                borderWidth: isSelf ? 4 : 2,
                pointRadius: isSelf ? 4 : 2,
                pointHoverRadius: isSelf ? 7 : 5,
                fill: isSelf, // only fill the user's own line area subtly
            };
        }),
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    color: "rgba(255, 255, 255, 0.7)",
                    font: {
                        family: "Outfit, Inter, sans-serif",
                        size: 11,
                        weight: "bold" as const,
                    },
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 8,
                },
            },
            tooltip: {
                backgroundColor: "#1C1C1E",
                titleColor: "#fff",
                bodyColor: "rgba(255, 255, 255, 0.8)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                cornerRadius: 12,
                titleFont: {
                    family: "Outfit, Inter, sans-serif",
                    weight: "bold" as const,
                },
                bodyFont: {
                    family: "Inter, sans-serif",
                },
                mode: "index" as const,
                intersect: false,
            },
        },
        scales: {
            x: {
                grid: {
                    color: "rgba(255, 255, 255, 0.04)",
                    drawTicks: false,
                },
                ticks: {
                    color: "rgba(255, 255, 255, 0.5)",
                    font: {
                        family: "Outfit, Inter, sans-serif",
                        size: 10,
                        weight: "bold" as const,
                    },
                },
            },
            y: {
                grid: {
                    color: "rgba(255, 255, 255, 0.04)",
                    drawTicks: false,
                },
                ticks: {
                    color: "rgba(255, 255, 255, 0.5)",
                    font: {
                        family: "Outfit, Inter, sans-serif",
                        size: 10,
                        weight: "bold" as const,
                    },
                },
            },
        },
        interaction: {
            mode: "index" as const,
            intersect: false,
        },
    };

    // Calculate Top 3 lists for highlight cards
    const top3Leader = [...usersData]
        .sort((a, b) => b.totalPoints - a.totalPoints || b.perfectPredictionsCount - a.perfectPredictionsCount)
        .slice(0, 3);

    const top3Average = [...usersData]
        .sort((a, b) => b.averagePoints - a.averagePoints || b.totalPoints - a.totalPoints)
        .slice(0, 3);

    const top3RoundsWon = [...usersData]
        .sort((a, b) => b.roundsWonCount - a.roundsWonCount || b.totalPoints - a.totalPoints)
        .slice(0, 3);

    const top3Perfect = [...usersData]
        .sort((a, b) => b.perfectPredictionsCount - a.perfectPredictionsCount || b.totalPoints - a.totalPoints)
        .slice(0, 3);

    // Dynamic width for horizontal scrolling graph (80px per race round)
    const chartMinWidth = Math.max(500, (completedRacesCount + 1) * 80);

    const toggleExpand = (userId: string) => {
        setExpandedUser(expandedUser === userId ? null : userId);
    };

    return (
        <div className="pb-32 pt-8 px-4 font-sans text-white">
            {/* Header */}
            <div className="mb-6">
                <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#E60000]/20 bg-[#E60000]/10 px-3 py-1">
                    <Activity className="h-3 w-3 text-[#E60000]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E60000]">
                        Wykresy & Analizy
                    </span>
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                    Statystyki
                </h1>
                <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">
                    Analityka i porównanie osiągów graczy
                </p>
            </div>

            {/* 1. PROGRESSION GRAPH CARD */}
            {completedRacesCount > 0 ? (
                <div className="mb-8 bg-[#1C1C1E] border border-white/5 rounded-3xl p-4 md:p-6 shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-white">
                                Przebieg Sezonu
                            </h3>
                        </div>
                        <Badge className="bg-[#E60000]/10 text-[#E60000] border-[#E60000]/20 font-bold">
                            {completedRacesCount} wyścigów
                        </Badge>
                    </div>

                    {/* Horizontally scrollable container */}
                    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 pb-2">
                        <div className="h-72 sm:h-96 relative" style={{ minWidth: `${chartMinWidth}px` }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-8 bg-[#1C1C1E] border border-white/5 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                    <Trophy className="h-12 w-12 text-gray-500/20 mb-4 animate-pulse" />
                    <h3 className="text-lg font-bold text-white uppercase mb-1">Czekamy na wyścigi</h3>
                    <p className="text-xs text-gray-500 max-w-sm">
                        Wykres punktacji runda po rundzie wygeneruje się automatycznie po dodaniu wyników pierwszego wyścigu przez administratora.
                    </p>
                </div>
            )}

            {/* 2. STATS HIGHLIGHT CARDS (Top 3 Lists) */}
            {completedRacesCount > 0 && (
                <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Leaderboard Leaders */}
                    <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2.5">
                            <span className="text-[9px] uppercase font-black tracking-wider text-gray-400">Liderzy Rankingu</span>
                            <Medal className="h-4 w-4 text-yellow-400 shrink-0" />
                        </div>
                        <div className="space-y-2">
                            {top3Leader.map((player, idx) => (
                                <div key={player.id} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="font-extrabold text-[10px] text-gray-500 w-3.5 shrink-0 text-center">
                                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                                        </span>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={player.avatar} alt={player.name} className="w-4.5 h-4.5 rounded-full object-cover shrink-0" />
                                        <span className="font-bold text-white truncate text-[11px] max-w-[65px] md:max-w-[90px]">{player.name}</span>
                                    </div>
                                    <span className="font-black text-[10px] text-gray-400 shrink-0">{player.totalPoints} pkt</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Best Average Leaders */}
                    <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2.5">
                            <span className="text-[9px] uppercase font-black tracking-wider text-gray-400">Najlepsza średnia</span>
                            <TrendingUp className="h-4 w-4 text-sky-400 shrink-0" />
                        </div>
                        <div className="space-y-2">
                            {top3Average.map((player, idx) => (
                                <div key={player.id} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="font-extrabold text-[10px] text-gray-500 w-3.5 shrink-0 text-center">
                                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                                        </span>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={player.avatar} alt={player.name} className="w-4.5 h-4.5 rounded-full object-cover shrink-0" />
                                        <span className="font-bold text-white truncate text-[11px] max-w-[65px] md:max-w-[90px]">{player.name}</span>
                                    </div>
                                    <span className="font-black text-[10px] text-gray-400 shrink-0">{player.averagePoints} śr</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Most Rounds Won */}
                    <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2.5">
                            <span className="text-[9px] uppercase font-black tracking-wider text-gray-400">Wygrane rundy</span>
                            <Zap className="h-4 w-4 text-[#E60000] shrink-0" />
                        </div>
                        <div className="space-y-2">
                            {top3RoundsWon.map((player, idx) => (
                                <div key={player.id} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="font-extrabold text-[10px] text-gray-500 w-3.5 shrink-0 text-center">
                                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                                        </span>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={player.avatar} alt={player.name} className="w-4.5 h-4.5 rounded-full object-cover shrink-0" />
                                        <span className="font-bold text-white truncate text-[11px] max-w-[65px] md:max-w-[90px]">{player.name}</span>
                                    </div>
                                    <span className="font-black text-[10px] text-gray-400 shrink-0">{player.roundsWonCount} wygr.</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Most Perfect Predictions */}
                    <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2.5">
                            <span className="text-[9px] uppercase font-black tracking-wider text-gray-400">Trafienia idealne</span>
                            <Target className="h-4 w-4 text-emerald-400 shrink-0" />
                        </div>
                        <div className="space-y-2">
                            {top3Perfect.map((player, idx) => (
                                <div key={player.id} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="font-extrabold text-[10px] text-gray-500 w-3.5 shrink-0 text-center">
                                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                                        </span>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={player.avatar} alt={player.name} className="w-4.5 h-4.5 rounded-full object-cover shrink-0" />
                                        <span className="font-bold text-white truncate text-[11px] max-w-[65px] md:max-w-[90px]">{player.name}</span>
                                    </div>
                                    <span className="font-black text-[10px] text-gray-400 shrink-0">{player.perfectPredictionsCount} poz</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 3. DETAILED PERFORMANCE COMPARISON LIST */}
            <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-4 md:p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-white">
                            Wyniki i Typowania Sezonu
                        </h3>
                    </div>
                </div>

                <div className="space-y-2.5">
                    {usersData.map((u, index) => {
                        const isExpanded = expandedUser === u.id;
                        const isSelf = u.id === currentUser?.id;

                        return (
                            <div
                                key={u.id}
                                className={clsx(
                                    "border rounded-2xl transition-all duration-200 overflow-hidden",
                                    isSelf ? "border-[#E60000]/30 bg-[#E60000]/3" : "border-white/[0.04] bg-[#121214]"
                                )}
                            >
                                {/* Main Row */}
                                <div
                                    onClick={() => toggleExpand(u.id)}
                                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-6 font-black text-xs text-gray-500 text-center shrink-0">
                                            {index + 1}
                                        </div>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-white flex items-center gap-2">
                                                {u.name}
                                                {isSelf && (
                                                    <span className="text-[9px] bg-[#E60000]/15 text-[#E60000] border border-[#E60000]/25 rounded-md px-1.5 py-0.5 font-bold uppercase">
                                                        Ja
                                                    </span>
                                                )}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {u.teamName && (
                                                    <>
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={getTeamLogo(u.teamName)} alt={u.teamName} className="w-3 h-3 object-contain shrink-0" />
                                                        <span className="text-[10px] text-gray-500 uppercase font-medium truncate max-w-[120px]">{u.teamName}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-right">
                                            <div className="text-base font-black text-white">{u.totalPoints} <span className="text-[10px] font-bold text-gray-500">pkt</span></div>
                                            {completedRacesCount > 0 && (
                                                <div className="text-[9px] font-bold text-gray-500 uppercase">Śr: {u.averagePoints}</div>
                                            )}
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Area */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 pt-2 border-t border-white/[0.04] bg-white/[0.01] space-y-4">
                                        {/* Player bio/faves */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#1C1C1E] p-3 rounded-xl border border-white/5">
                                                <span className="text-[8px] uppercase font-bold text-gray-500 block mb-0.5">Ulubiony kierowca</span>
                                                <span className="text-xs font-bold text-white">{u.favoriteDriverName || "Nie wybrano"}</span>
                                            </div>
                                            <div className="bg-[#1C1C1E] p-3 rounded-xl border border-white/5">
                                                <span className="text-[8px] uppercase font-bold text-gray-500 block mb-0.5">Trafienia idealne</span>
                                                <span className="text-xs font-bold text-white">{u.perfectPredictionsCount} / {completedRacesCount * 10} pozycji</span>
                                            </div>
                                        </div>

                                        {/* Driver prediction stats */}
                                        <div>
                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                                                <Sparkles className="w-3 h-3 text-[#E60000]" /> Statystyki Typowania Kierowców
                                            </h4>

                                            {u.driverStats ? (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="bg-[#1C1C1E]/50 p-2.5 rounded-xl border border-white/5">
                                                        <span className="text-[8px] uppercase font-bold text-gray-500 block">Najwyżej typowany</span>
                                                        <span className="text-xs font-bold text-green-400 truncate block mt-0.5">{u.driverStats.mostPopular?.name || "Brak"}</span>
                                                        <span className="text-[9px] text-gray-500 block mt-0.5">śr. poz: {u.driverStats.mostPopular?.value}</span>
                                                    </div>
                                                    <div className="bg-[#1C1C1E]/50 p-2.5 rounded-xl border border-white/5">
                                                        <span className="text-[8px] uppercase font-bold text-gray-500 block">Najniżej typowany</span>
                                                        <span className="text-xs font-bold text-red-400 truncate block mt-0.5">{u.driverStats.leastPopular?.name || "Brak"}</span>
                                                        <span className="text-[9px] text-gray-500 block mt-0.5">śr. poz: {u.driverStats.leastPopular?.value}</span>
                                                    </div>
                                                    <div className="bg-[#1C1C1E]/50 p-2.5 rounded-xl border border-white/5">
                                                        <span className="text-[8px] uppercase font-bold text-gray-500 block">Najlepiej typowany (Pkt)</span>
                                                        <span className="text-xs font-bold text-yellow-400 truncate block mt-0.5">{u.driverStats.mostAccurate?.name || "Brak"}</span>
                                                        <span className="text-[9px] text-gray-500 block mt-0.5">punkty: {u.driverStats.mostAccurate?.value} pkt</span>
                                                    </div>
                                                    <div className="bg-[#1C1C1E]/50 p-2.5 rounded-xl border border-white/5">
                                                        <span className="text-[8px] uppercase font-bold text-gray-500 block">Najgorzej typowany</span>
                                                        <span className="text-xs font-bold text-amber-500 truncate block mt-0.5">{u.driverStats.leastAccurate?.name || "Brak"}</span>
                                                        <span className="text-[9px] text-gray-500 block mt-0.5">śr. błąd: ±{u.driverStats.leastAccurate?.value} poz</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-[#1C1C1E]/50 p-3.5 rounded-xl border border-white/5 flex items-center justify-center gap-2 text-gray-500 text-xs font-bold uppercase">
                                                    Brak danych typowania dla tego gracza
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
