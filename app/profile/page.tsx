"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { logoutUser, updateProfile } from "@/app/actions/auth";
import { getProfileOptions } from "@/app/actions/profile";
import { User, LogOut, Edit3, Check, X, ChevronDown, Camera } from "lucide-react";
import { getTeamLogo } from "@/lib/data";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Resizer from "react-image-file-resizer";

type Team = { id: string; name: string };
type DriverOption = { slug: string; name: string; number: number; team: { name: string } };

export default function ProfilePage() {
    const { user, loading, refreshUser } = useAuth();
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    
    useEffect(() => {
        if (!loading && user?.isAdmin) {
            router.push("/admin");
        }
    }, [user, loading, router]);
    const [saving, setSaving] = useState(false);

    // Editable fields
    const [name, setName] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedDriver, setSelectedDriver] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

    // Dropdown options from DB
    const [teams, setTeams] = useState<Team[]>([]);
    const [drivers, setDrivers] = useState<DriverOption[]>([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);

    // Sync form state when user loads
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setSelectedTeam(user.team || "");
            setSelectedDriver(user.favoriteDriverSlug || "");
        }
    }, [user]);

    // Load dropdown options when editing starts
    useEffect(() => {
        if (editing && !optionsLoaded) {
            getProfileOptions().then(({ teams, drivers }) => {
                setTeams(teams);
                setDrivers(drivers);
                setOptionsLoaded(true);
            });
        }
    }, [editing, optionsLoaded]);

    // Filter drivers by selected team
    const filteredDrivers = selectedTeam
        ? drivers.filter(d => d.team.name === selectedTeam)
        : drivers;

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.set("name", name);
            formData.set("team", selectedTeam);
            formData.set("favoriteDriver", selectedDriver);
            if (avatarFile) {
                formData.set("avatar", avatarFile);
            }

            const result = await updateProfile(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Profil zaktualizowany!");
                await refreshUser();
                setEditing(false);
            }
        } catch {
            toast.error("Błąd podczas zapisywania profilu");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset to current user values
        if (user) {
            setName(user.name || "");
            setSelectedTeam(user.team || "");
            setSelectedDriver(user.favoriteDriverSlug || "");
        }
        setAvatarFile(null);
        setPreviewAvatar(null);
        setEditing(false);
    };

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
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                    Profil
                </h1>
                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1E] hover:bg-[#2C2C2E] border border-white/10 rounded-xl text-sm font-bold text-gray-300 transition-all active:scale-95"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edytuj
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-1 px-3 py-2 bg-[#1C1C1E] hover:bg-[#2C2C2E] border border-white/10 rounded-xl text-sm font-bold text-gray-400 transition-all active:scale-95"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-1 px-4 py-2 bg-[#E60000] hover:bg-red-700 border border-red-500 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Check className="w-4 h-4" />
                            {saving ? "..." : "Zapisz"}
                        </button>
                    </div>
                )}
            </div>

            {/* Avatar & Name Card */}
            <div className="bg-[#1C1C1E] rounded-[2rem] p-8 border border-white/5 mb-6 text-center">
                <div className="relative inline-block mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={previewAvatar || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=E60000&color=fff&bold=true&size=150`}
                        alt={user.name || "User Avatar"}
                        className="w-24 h-24 rounded-full object-cover border-4 border-[#E60000] shadow-lg shadow-red-900/20"
                    />
                    
                    {editing ? (
                        <label className="absolute -bottom-1 -right-1 bg-[#E60000] p-2 flex items-center justify-center rounded-full border-2 border-[#1C1C1E] cursor-pointer hover:scale-110 active:scale-95 transition-all">
                            <Camera className="w-4 h-4 text-white" />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const file = e.target.files[0];
                                        
                                        try {
                                            Resizer.imageFileResizer(
                                                file,
                                                400, // maxWidth
                                                400, // maxHeight
                                                "JPEG", // compressFormat
                                                80, // quality
                                                0, // rotation
                                                (uri) => {
                                                    const resizedFile = uri as File;
                                                    setAvatarFile(resizedFile);
                                                    setPreviewAvatar(URL.createObjectURL(resizedFile));
                                                },
                                                "file" // outputType
                                            );
                                        } catch (err) {
                                            console.error("Błąd kompresji obrazka", err);
                                            toast.error("Błąd podczas kompresji zdjęcia");
                                        }
                                    }
                                }}
                            />
                        </label>
                    ) : (
                        <div className="absolute -bottom-1 -right-1 bg-[#E60000] p-2 rounded-full border-2 border-[#1C1C1E]">
                            <User className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>

                {editing ? (
                    <div className="max-w-xs mx-auto">
                        <label className="text-gray-500 text-[10px] uppercase font-bold mb-2 block text-left">Imię</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-lg text-center focus:outline-none focus:border-[#E60000] transition-colors"
                            placeholder="Twoje imię"
                        />
                    </div>
                ) : (
                    <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{user.name}</h2>
                )}
            </div>

            {/* Team & Driver Selection */}
            <div className="space-y-4 mb-6">
                {/* Team */}
                <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5">
                    <div className="text-gray-500 text-[10px] uppercase font-bold mb-3 tracking-wider">Ulubiony zespół</div>
                    {editing ? (
                        <div className="relative">
                            <select
                                value={selectedTeam}
                                onChange={e => {
                                    setSelectedTeam(e.target.value);
                                    // Reset driver when team changes
                                    setSelectedDriver("");
                                }}
                                className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-4 py-3 text-white font-bold appearance-none cursor-pointer focus:outline-none focus:border-[#E60000] transition-colors"
                            >
                                <option value="">Brak zespołu</option>
                                {teams.map(t => (
                                    <option key={t.id} value={t.name}>{t.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getTeamLogo(user.team || "Independent")}
                                alt={user.team || "Independent"}
                                className="w-6 h-6 object-contain"
                            />
                            <span className="text-white font-bold text-lg">{user.team || "Nie wybrano"}</span>
                        </div>
                    )}
                </div>

                {/* Favorite Driver */}
                <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5">
                    <div className="text-gray-500 text-[10px] uppercase font-bold mb-3 tracking-wider">Ulubiony kierowca</div>
                    {editing ? (
                        <div className="relative">
                            <select
                                value={selectedDriver}
                                onChange={e => setSelectedDriver(e.target.value)}
                                className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-4 py-3 text-white font-bold appearance-none cursor-pointer focus:outline-none focus:border-[#E60000] transition-colors"
                            >
                                <option value="">Brak ulubionego</option>
                                {filteredDrivers.map(d => (
                                    <option key={d.slug} value={d.slug}>#{d.number} {d.name} ({d.team.name})</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#E60000]/20 flex items-center justify-center text-[#E60000] text-xs font-black">
                                ★
                            </div>
                            <span className="text-white font-bold text-lg">{user.favoriteDriver || "Nie wybrano"}</span>
                        </div>
                    )}
                </div>

                {/* Status & Season info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5">
                        <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">Status</div>
                        <div className="text-white font-bold text-sm">Aktywny</div>
                    </div>
                    <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5">
                        <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">Sezon</div>
                        <div className="text-white font-bold text-sm">2026</div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
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
