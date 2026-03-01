"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingClient() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [phase, setPhase] = useState<"driving" | "stopping" | "done">("driving");

    useEffect(() => {
        if (loading || user) return;

        const t1 = setTimeout(() => setPhase("stopping"), 1100);
        const t2 = setTimeout(() => setPhase("done"), 1600);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [loading, user]);

    useEffect(() => {
        const redirectUser = async () => {
            if (loading || !user) return;

            if (user.isAdmin) {
                router.replace("/admin");
                return;
            }

            // Regular users
            router.replace("/calendar");
        };
        redirectUser();
    }, [user, loading, router]);

    if (loading || user) return null;

    return (
        <>
            <style>{`
                @keyframes driveIn {
                    0%   { transform: translateX(-130vw) scaleX(1); }
                    85%  { transform: translateX(0vw)   scaleX(1); }
                    100% { transform: translateX(0vw)   scaleX(1); }
                }

                @keyframes skid {
                    0%   { transform: translateX(0)    scaleX(1.08); }
                    20%  { transform: translateX(6px)  scaleX(0.93); }
                    40%  { transform: translateX(-4px) scaleX(1.05); }
                    60%  { transform: translateX(3px)  scaleX(0.97); }
                    80%  { transform: translateX(-2px) scaleX(1.02); }
                    100% { transform: translateX(0)    scaleX(1); }
                }

                @keyframes speedLine {
                    0%   { transform: scaleX(0); opacity: 0.7; }
                    60%  { transform: scaleX(1); opacity: 0.5; }
                    100% { transform: scaleX(1); opacity: 0; }
                }

                @keyframes smokePuff {
                    0%   { transform: translateY(0)    scale(0.5); opacity: 0.85; }
                    100% { transform: translateY(-48px) scale(1.6); opacity: 0; }
                }

                @keyframes dustStreak {
                    0%   { width: 0;     opacity: 0.6; }
                    60%  { width: 80px; opacity: 0.35; }
                    100% { width: 120px; opacity: 0; }
                }

                .car-driving {
                    animation: driveIn 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                .car-stopping {
                    animation: skid 0.45s ease-out forwards;
                }

                .speed-line {
                    transform-origin: left center;
                    animation: speedLine 1.1s ease-out forwards;
                }

                .smoke-puff {
                    animation: smokePuff 0.9s ease-out forwards;
                }

                .dust-streak {
                    animation: dustStreak 0.6s ease-out forwards;
                }

                @keyframes contentReveal {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .content-reveal {
                    animation: contentReveal 0.6s ease-out forwards;
                }
            `}</style>

            <div className="flex flex-col items-center justify-center fixed inset-0 bg-[#0D0D0D] text-white px-4 z-[60] overflow-hidden">
                <div className="relative flex items-center justify-center mb-2" style={{ height: "120px", width: "220px" }}>
                    {phase === "driving" && (
                        <div className="absolute inset-0 flex flex-col justify-center gap-[6px] pointer-events-none" style={{ right: "50%", left: "-80px" }}>
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="speed-line h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#E60000] to-transparent"
                                    style={{
                                        animationDelay: `${i * 0.06}s`,
                                        opacity: 0,
                                        width: `${60 + i * 18}px`,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {phase === "driving" && (
                        <div className="absolute" style={{ right: "calc(50% + 36px)", top: "50%", transform: "translateY(-50%)" }}>
                            {["💨", "💨", "💨"].map((emoji, i) => (
                                <span
                                    key={i}
                                    className="smoke-puff absolute text-xl"
                                    style={{
                                        animationDelay: `${0.2 + (2 - i) * 0.2}s`,
                                        left: `${-i * 24}px`,
                                        opacity: 0,
                                        fontSize: `${0.9 + i * 0.15}rem`,
                                        display: "inline-block",
                                        transform: "scaleX(-1)"
                                    }}
                                >
                                    {emoji}
                                </span>
                            ))}
                        </div>
                    )}

                    {phase === "stopping" && (
                        <>
                            <div
                                className="dust-streak absolute rounded-full bg-[#E60000]/30"
                                style={{ height: "4px", bottom: "28px", left: "50%", transform: "translateX(-60px)" }}
                            />
                            <div
                                className="dust-streak absolute rounded-full bg-white/15"
                                style={{ height: "3px", bottom: "22px", left: "50%", transform: "translateX(-60px)", animationDelay: "0.05s" }}
                            />
                        </>
                    )}

                    <div
                        className={`text-8xl select-none ${
                            phase === "driving" ? "car-driving" : phase === "stopping" ? "car-stopping" : ""
                        }`}
                        style={phase === "driving" ? { willChange: "transform" } : {}}
                    >
                        <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>🏎️</span>
                    </div>
                </div>

                <div className={`text-center max-w-lg space-y-6 ${phase === "done" ? "content-reveal" : "opacity-0"}`}>
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                        F1 Vote <span className="text-[#E60000]">2026</span>
                    </h1>

                    <div className="grid gap-4 w-full pt-8">
                        <Link
                            href="/login"
                            className="w-full bg-[#E60000] hover:bg-red-700 text-white p-5 rounded-2xl font-black uppercase tracking-wider text-xl shadow-[0_0_30px_-5px_rgba(230,0,0,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 text-center"
                        >
                            Zaloguj
                        </Link>

                        <Link
                            href="/register"
                            className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] border border-white/5 text-white p-5 rounded-2xl font-black uppercase tracking-wider text-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-center"
                        >
                            Zarejestruj
                        </Link>
                    </div>

                    <div className="pt-12 flex justify-center gap-8 opacity-50">
                        <div className="text-center">
                            <div className="text-2xl font-black">20+</div>
                            <div className="text-[10px] uppercase tracking-widest text-gray-500">Kierowców</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black">24</div>
                            <div className="text-[10px] uppercase tracking-widest text-gray-500">Wyścigi</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black">1</div>
                            <div className="text-[10px] uppercase tracking-widest text-gray-500">Mistrz</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
