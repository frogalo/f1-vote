"use client";

import { useRouter } from "next/navigation";
import { useState, use } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import { resetPassword } from "@/app/actions/reset-password";
import { toast } from "sonner";
import { KeyRound, ArrowRight } from "lucide-react";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("token", resolvedParams.token);
            formData.append("password", password);
            formData.append("confirmPassword", confirmPassword);

            const result = await resetPassword(formData);

            if (result.error) {
                setError(result.error);
                toast.error(result.error);
                return;
            }

            if (result.success) {
                setSuccess(true);
                toast.success("Hasło zostało zmienione.");
                setTimeout(() => {
                    router.replace("/login");
                }, 3000);
            }
        } catch (err: unknown) {
            const msg = (err instanceof Error ? err.message : String(err)) || "Wystąpił błąd";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center fixed inset-0 bg-[#0D0D0D] px-4 overflow-hidden z-[60]">
                <div className="w-full max-w-sm text-center">
                    <div className="w-16 h-16 bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <KeyRound className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
                        Gotowe!
                    </h1>
                    <p className="text-gray-400 mb-8 font-medium">
                        Twoje hasło zostało zmienione pomyślnie.
                        <br />
                        Za chwilę zostaniesz przekierowany do logowania.
                    </p>
                    <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-[#1C1C1E] hover:bg-white/10 border border-white/10 text-white p-4 rounded-xl font-black uppercase tracking-wider transition-all w-full">
                        Przejdź do logowania <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center fixed inset-0 bg-[#0D0D0D] px-4 overflow-hidden z-[60]">
            <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter text-center">
                Reset <span className="text-[#E60000]">Hasła</span>
            </h1>
            <p className="text-gray-500 mb-8 font-bold tracking-widest text-sm uppercase text-center">Wpisz nowe hasło</p>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Nowe hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#1C1C1E] border border-white/10 p-4 rounded-xl text-white placeholder-gray-500 font-medium focus:border-[#E60000] outline-none transition-colors"
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Powtórz nowe hasło"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {loading ? "Przetwarzanie..." : "Zatwierdź"}
                </button>

                <div className="text-center mt-6">
                    <Link href="/login" className="text-gray-500 text-sm font-medium hover:text-white transition-colors">
                        Pamiętasz hasło? <span className="text-[#E60000] font-bold">Wróć do logowania</span>
                    </Link>
                </div>
            </form>
        </div>
    );
}
