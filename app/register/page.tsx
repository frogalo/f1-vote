"use client";

import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";
import { drivers, getTeamLogo } from "@/lib/data";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";

export default function RegisterPage() {
    const router = useRouter();
    const { setUserId } = useStore();
    const { user, loading: authLoading } = useAuth();
    const [name, setName] = useState("");
    const [team, setTeam] = useState("");
    const [favoriteDriver, setFavoriteDriver] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [teamOpen, setTeamOpen] = useState(false);
    const [driverOpen, setDriverOpen] = useState(false);

    const teamRef = useRef<HTMLDivElement>(null);
    const driverRef = useRef<HTMLDivElement>(null);

    const teams = Array.from(new Set(drivers.map(d => d.team))).sort();
    const sortedDrivers = [...drivers].sort((a, b) => a.name.localeCompare(b.name));

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            router.push(user.isAdmin ? "/admin" : "/season");
        }
    }, [user, authLoading, router]);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (teamRef.current && !teamRef.current.contains(e.target as Node)) {
                setTeamOpen(false);
            }
            if (driverRef.current && !driverRef.current.contains(e.target as Node)) {
                setDriverOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const selectedDriver = drivers.find(d => d.id === favoriteDriver);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!team) {
            toast.error("Wybierz swój ulubiony zespół");
            return;
        }
        if (!favoriteDriver) {
            toast.error("Wybierz swojego ulubionego kierowcę");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("team", team);
            formData.append("favoriteDriver", favoriteDriver);
            formData.append("username", name); // Use name as username
            formData.append("password", password);

            const result = await registerUser(formData);

            if (result.error) {
                setError(result.error);
                toast.error(result.error);
                return;
            }

            if (result.success && result.user) {
                toast.success("Zarejestrowano pomyślnie!");
                setUserId(result.user.id); // Update local store
                router.push("/season"); // Redirect to season voting
            }
        } catch (err: any) {
            const msg = err.message || "An error occurred";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center fixed inset-0 bg-[#0D0D0D] px-4 overflow-hidden z-[60]">
            <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter text-center">
                F1 Vote <span className="text-[#E60000]">2026</span>
            </h1>
            <p className="text-gray-500 mb-8 font-bold tracking-widest text-sm uppercase text-center">Dołącz do stawki</p>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Imię"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#1C1C1E] border border-white/10 p-4 rounded-xl text-white placeholder-gray-500 font-medium focus:border-[#E60000] outline-none transition-colors"
                        required
                    />
                </div>

                {/* Custom Team Dropdown */}
                <div ref={teamRef} className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setTeamOpen(!teamOpen);
                            setDriverOpen(false);
                        }}
                        className={clsx(
                            "w-full bg-[#1C1C1E] border border-white/10 p-4 rounded-xl font-medium text-left flex items-center gap-3 transition-colors",
                            team ? "text-white" : "text-gray-500",
                            teamOpen && "border-[#E60000]"
                        )}
                    >
                        {team ? (
                            <>
                                <img
                                    src={getTeamLogo(team)}
                                    alt={team}
                                    className="w-5 h-5 object-contain"
                                />
                                <span className="flex-1">{team}</span>
                            </>
                        ) : (
                            <span className="flex-1">Ulubiony zespół</span>
                        )}
                        <ChevronDown className={clsx("w-4 h-4 text-gray-500 transition-transform", teamOpen && "rotate-180")} />
                    </button>

                    {teamOpen && (
                        <div className="absolute z-[70] top-full mt-1 left-0 right-0 bg-[#1C1C1E] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50 max-h-60 overflow-y-auto">
                            {teams.map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => {
                                        setTeam(t);
                                        setTeamOpen(false);
                                    }}
                                    className={clsx(
                                        "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#2C2C2E] transition-colors",
                                        team === t ? "text-[#E60000] bg-[#E60000]/5" : "text-white"
                                    )}
                                >
                                    <img
                                        src={getTeamLogo(t)}
                                        alt={t}
                                        className="w-5 h-5 object-contain"
                                    />
                                    <span className="font-medium">{t}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Custom Driver Dropdown */}
                <div ref={driverRef} className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setDriverOpen(!driverOpen);
                            setTeamOpen(false);
                        }}
                        className={clsx(
                            "w-full bg-[#1C1C1E] border border-white/10 p-4 rounded-xl font-medium text-left flex items-center gap-3 transition-colors",
                            favoriteDriver ? "text-white" : "text-gray-500",
                            driverOpen && "border-[#E60000]"
                        )}
                    >
                        {selectedDriver ? (
                            <>
                                <img
                                    src={getTeamLogo(selectedDriver.team)}
                                    alt={selectedDriver.team}
                                    className="w-5 h-5 object-contain"
                                />
                                <span className="flex-1">{selectedDriver.name}</span>
                            </>
                        ) : (
                            <span className="flex-1">Ulubiony kierowca</span>
                        )}
                        <ChevronDown className={clsx("w-4 h-4 text-gray-500 transition-transform", driverOpen && "rotate-180")} />
                    </button>

                    {driverOpen && (
                        <div className="absolute z-[70] top-full mt-1 left-0 right-0 bg-[#1C1C1E] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50 max-h-60 overflow-y-auto">
                            {sortedDrivers.map(d => (
                                <button
                                    key={d.id}
                                    type="button"
                                    onClick={() => {
                                        setFavoriteDriver(d.id);
                                        setDriverOpen(false);
                                    }}
                                    className={clsx(
                                        "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#2C2C2E] transition-colors",
                                        favoriteDriver === d.id ? "text-[#E60000] bg-[#E60000]/5" : "text-white"
                                    )}
                                >
                                    <img
                                        src={getTeamLogo(d.team)}
                                        alt={d.team}
                                        className="w-5 h-5 object-contain"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{d.name}</span>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{d.team}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#1C1C1E] border border-white/10 p-4 rounded-xl text-white placeholder-gray-500 font-medium focus:border-[#E60000] outline-none transition-colors"
                        required
                    />
                </div>

                {error && <div className="text-[#E60000] text-sm font-bold text-center">{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className={clsx(
                        "w-full bg-[#E60000] text-white p-4 rounded-xl font-black uppercase tracking-wider text-lg shadow-lg shadow-red-900/20 active:scale-95 transition-all mt-4",
                        loading && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {loading ? "Rejestrowanie..." : "Zarejestruj"}
                </button>

                <div className="text-center mt-6">
                    <Link href="/login" className="text-gray-500 text-sm font-medium hover:text-white transition-colors">
                        Już w stawce? <span className="text-[#E60000] font-bold">Zaloguj się</span>
                    </Link>
                </div>
            </form>
        </div>
    );
}
