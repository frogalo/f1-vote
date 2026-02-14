"use client";

import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import { loginUser } from "@/app/actions/auth";

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
            const result = await loginUser(new FormData(e.target as HTMLFormElement));

            if (result.error) {
                setError(result.error);
                return;
            }

            if (result.success && result.user) {
                setUserId(result.user.id);
                // Also load mock data? No, detach mock user votes logic.
                router.push("/season");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D0D] px-4">
            <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
                F1 Vote <span className="text-[#E60000]">2026</span>
            </h1>
            <p className="text-gray-500 mb-8 font-bold tracking-widest text-sm uppercase">Zaloguj do Padoku</p>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <div>
                    <input
                        type="text"
                        name="username"
                        placeholder="Użytkownik"
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
                        "w-full bg-[#E60000] text-white p-4 rounded-xl font-black uppercase tracking-wider text-lg shadow-lg shadow-red-900/20 active:scale-95 transition-all",
                        loading && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {loading ? "Rozgrzewanie opon..." : "Start wyścigu"}
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
