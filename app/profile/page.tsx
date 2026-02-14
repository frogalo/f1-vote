"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { logoutUser } from "@/app/actions/auth";
import { User, LogOut, Shield, Settings } from "lucide-react";

export default function ProfilePage() {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#E60000]"></div>
        </div>
    );

    if (!user) return (
        <div className="text-center p-8">
            <p className="text-gray-500 mb-4">Nie jesteś zalogowany.</p>
        </div>
    );

    return (
        <div className="pb-32 pt-8 px-4">
            <h1 className="text-4xl font-black mb-8 text-white uppercase tracking-tighter">
                Profil <span className="text-[#E60000]">Kierowcy</span>
            </h1>

            <div className="bg-[#1C1C1E] rounded-[2rem] p-8 border border-white/5 mb-6 text-center">
                <div className="relative inline-block mb-4">
                    <img 
                        src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} 
                        alt={user.name} 
                        className="w-24 h-24 rounded-full border-4 border-[#E60000] shadow-lg shadow-red-900/20"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#E60000] p-2 rounded-full border-2 border-[#1C1C1E]">
                        <User className="w-4 h-4 text-white" />
                    </div>
                </div>
                
                <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{user.name}</h2>
                <p className="text-[#E60000] text-sm font-bold uppercase tracking-widest mb-6">{user.team || "Independent"}</p>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#2C2C2E] p-4 rounded-2xl">
                        <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">Status</div>
                        <div className="text-white font-bold text-sm">Aktywny</div>
                    </div>
                    <div className="bg-[#2C2C2E] p-4 rounded-2xl">
                        <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">Sezon</div>
                        <div className="text-white font-bold text-sm">2026</div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-5 bg-[#1C1C1E] hover:bg-[#2C2C2E] border border-white/5 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4">
                        <Settings className="w-5 h-5 text-gray-500 group-hover:text-white" />
                        <span className="font-bold text-white">Ustawienia konta</span>
                    </div>
                    <span className="text-gray-600">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-5 bg-[#1C1C1E] hover:bg-[#2C2C2E] border border-white/5 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4">
                        <Shield className="w-5 h-5 text-gray-500 group-hover:text-white" />
                        <span className="font-bold text-white">Prywatność</span>
                    </div>
                    <span className="text-gray-600">→</span>
                </button>
                <button 
                    onClick={() => logoutUser()}
                    className="w-full flex items-center justify-between p-5 bg-red-900/10 hover:bg-red-900/20 border border-red-900/20 rounded-2xl transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <LogOut className="w-5 h-5 text-[#E60000]" />
                        <span className="font-bold text-[#E60000]">Wyloguj się</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
