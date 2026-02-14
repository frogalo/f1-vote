"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from 'next/link';

export default function LandingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push("/season");
        }
    }, [user, loading, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D0D] text-white px-4 relative overflow-hidden">
             
             {/* Background Effects */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/20 rounded-full blur-[100px] z-0 pointer-events-none" />
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/10 rounded-full blur-[80px] z-0 pointer-events-none" />

            <div className="z-10 text-center max-w-lg space-y-6">
                 {/* Hero Icon/Logo */}
                 <div className="text-8xl mb-4 animate-in slide-in-from-bottom-10 fade-in duration-1000">
                    🏎️
                 </div>

                <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none animate-in slide-in-from-bottom-5 fade-in duration-1000 delay-100">
                    F1 Vote <span className="text-[#E60000]">2026</span>
                </h1>
                
                <div className="grid gap-4 w-full pt-8 animate-in slide-in-from-bottom-5 fade-in duration-1000 delay-300">
                    <Link 
                        href="/login" 
                        className="w-full bg-[#E60000] hover:bg-red-700 text-white p-5 rounded-2xl font-black uppercase tracking-wider text-xl shadow-[0_0_30px_-5px_rgba(230,0,0,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Zaloguj
                    </Link>
                    
                    <Link 
                        href="/register" 
                        className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] border border-white/5 text-white p-5 rounded-2xl font-black uppercase tracking-wider text-xl active:scale-95 transition-all text-center"
                    >
                        Zarejestruj
                    </Link>
                </div>

                <div className="pt-12 flex justify-center gap-8 opacity-50 animate-in fade-in duration-1000 delay-500">
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
    );
}
