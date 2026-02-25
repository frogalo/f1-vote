"use client";

import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import { loginUser } from "@/app/actions/auth";
import { hasSeasonVotes } from "@/app/actions/seasonVote";
import { getNextRound } from "@/app/actions/races";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const { setUserId } = useStore();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const result = await loginUser(formData);

            if (result.error) {
                setError(result.error);
                toast.error(result.error);
                return;
            }

            if (result.success && result.user) {
                toast.success(`Witaj ponownie, ${result.user.name}!`);
                setUserId(result.user.id);
                
                if (result.user.isAdmin) {
                    router.push("/admin");
                    return;
                }

                // Check if user needs to set up seasonal votes
                const hasSeason = await hasSeasonVotes();
                if (!hasSeason) {
                    router.push("/season");
                } else {
                    const nextRound = await getNextRound();
                    router.push(`/race/${nextRound}`);
                }
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
            <p className="text-gray-500 mb-8 font-bold tracking-widest text-sm uppercase text-center">Zaloguj do Padoku</p>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <div>
                    <input
                        type="text"
                        name="username"
                        placeholder="Imię"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#1C1C1E] border border-white/10 p-4 rounded-xl text-white placeholder-gray-500 font-medium focus:border-[#E60000] outline-none transition-colors"
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
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
                    {loading ? "Rozgrzewanie opon..." : "Zaloguj"}
                </button>

                <div className="text-center mt-6">
                    <Link href="/register" className="text-gray-500 text-sm font-medium hover:text-white transition-colors">
                        Nowy rekrut? <span className="text-[#E60000] font-bold">Zarejestruj się</span>
                    </Link>
                </div>
            </form>
        </div>
    );
}
