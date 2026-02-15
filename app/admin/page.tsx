"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTeams, getDrivers, addDriver, updateDriver, deleteDriver } from "@/app/actions/admin";
import { toast } from "sonner";
import { Plus, Trash2, Edit3, X, Shield, Users, ChevronDown } from "lucide-react";
import { clsx } from "clsx";

type Team = {
    id: string;
    name: string;
    color: string | null;
    drivers: { slug: string; name: string; number: number; country: string | null; color: string | null }[];
};

type DriverRow = {
    slug: string;
    name: string;
    number: number;
    country: string | null;
    color: string | null;
    teamId: string;
    team: { name: string };
};

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [teams, setTeams] = useState<Team[]>([]);
    const [drivers, setDrivers] = useState<DriverRow[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // Form state
    const [formSlug, setFormSlug] = useState("");
    const [formName, setFormName] = useState("");
    const [formNumber, setFormNumber] = useState("");
    const [formCountry, setFormCountry] = useState("");
    const [formTeamId, setFormTeamId] = useState("");
    const [formColor, setFormColor] = useState("");

    useEffect(() => {
        if (!loading && (!user || !user.isAdmin)) {
            router.push("/");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user?.isAdmin) {
            loadData();
        }
    }, [user]);

    async function loadData() {
        setDataLoading(true);
        try {
            const [teamsData, driversData] = await Promise.all([getTeams(), getDrivers()]);
            setTeams(teamsData as Team[]);
            setDrivers(driversData as DriverRow[]);
        } catch (err) {
            toast.error("Nie udało się załadować danych");
        } finally {
            setDataLoading(false);
        }
    }

    function resetForm() {
        setFormSlug("");
        setFormName("");
        setFormNumber("");
        setFormCountry("");
        setFormTeamId("");
        setFormColor("");
        setEditingSlug(null);
        setShowForm(false);
    }

    function openEditForm(driver: DriverRow) {
        setFormSlug(driver.slug);
        setFormName(driver.name);
        setFormNumber(String(driver.number));
        setFormCountry(driver.country || "");
        setFormTeamId(driver.teamId);
        setFormColor(driver.color || "");
        setEditingSlug(driver.slug);
        setShowForm(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormLoading(true);

        try {
            const formData = new FormData();
            formData.append("slug", formSlug);
            formData.append("name", formName);
            formData.append("number", formNumber);
            formData.append("country", formCountry);
            formData.append("teamId", formTeamId);
            formData.append("color", formColor);

            let result;
            if (editingSlug) {
                result = await updateDriver(formData);
            } else {
                result = await addDriver(formData);
            }

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success(editingSlug ? "Kierowca zaktualizowany!" : "Kierowca dodany!");
            resetForm();
            await loadData();
        } catch (err: any) {
            toast.error(err.message || "Wystąpił błąd");
        } finally {
            setFormLoading(false);
        }
    }

    async function handleDelete(slug: string, name: string) {
        if (!confirm(`Usunąć kierowcę ${name}? Wszystkie powiązane głosy zostaną usunięte.`)) return;

        try {
            const result = await deleteDriver(slug);
            if (result.success) {
                toast.success(`Usunięto ${name}`);
                await loadData();
            }
        } catch (err: any) {
            toast.error(err.message || "Nie udało się usunąć");
        }
    }

    if (loading || !user?.isAdmin) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#E60000]"></div>
            </div>
        );
    }

    return (
        <div className="pb-32 pt-8 px-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#E60000] p-2.5 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Panel <span className="text-[#E60000]">Admina</span>
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Zarządzaj kierowcami</p>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Zespoły</div>
                    <div className="text-3xl font-black text-white">{teams.length}</div>
                </div>
                <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Kierowcy</div>
                    <div className="text-3xl font-black text-white">{drivers.length}</div>
                </div>
            </div>

            {/* Add driver button */}
            <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="w-full flex items-center justify-center gap-3 p-4 bg-[#E60000] hover:bg-red-700 rounded-2xl font-black uppercase tracking-wider text-white transition-all active:scale-[0.98] mb-8 shadow-lg shadow-red-900/20"
            >
                <Plus className="w-5 h-5" />
                Dodaj Kierowcę
            </button>

            {/* Add/Edit form (modal-like) */}
            {showForm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                    <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">
                                {editingSlug ? "Edytuj" : "Nowy"} <span className="text-[#E60000]">Kierowca</span>
                            </h2>
                            <button onClick={resetForm} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">
                                    Slug (ID) *
                                </label>
                                <input
                                    type="text"
                                    value={formSlug}
                                    onChange={(e) => setFormSlug(e.target.value.toLowerCase())}
                                    disabled={!!editingSlug}
                                    placeholder="np. ver"
                                    className="w-full bg-[#2C2C2E] border border-white/10 p-3 rounded-xl text-white placeholder-gray-600 font-medium focus:border-[#E60000] outline-none transition-colors disabled:opacity-50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">
                                    Imię i nazwisko *
                                </label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="Max Verstappen"
                                    className="w-full bg-[#2C2C2E] border border-white/10 p-3 rounded-xl text-white placeholder-gray-600 font-medium focus:border-[#E60000] outline-none transition-colors"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">
                                        Numer *
                                    </label>
                                    <input
                                        type="number"
                                        value={formNumber}
                                        onChange={(e) => setFormNumber(e.target.value)}
                                        placeholder="1"
                                        className="w-full bg-[#2C2C2E] border border-white/10 p-3 rounded-xl text-white placeholder-gray-600 font-medium focus:border-[#E60000] outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">
                                        Kraj
                                    </label>
                                    <input
                                        type="text"
                                        value={formCountry}
                                        onChange={(e) => setFormCountry(e.target.value)}
                                        placeholder="🇳🇱"
                                        className="w-full bg-[#2C2C2E] border border-white/10 p-3 rounded-xl text-white placeholder-gray-600 font-medium focus:border-[#E60000] outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">
                                    Zespół *
                                </label>
                                <div className="relative">
                                    <select
                                        value={formTeamId}
                                        onChange={(e) => setFormTeamId(e.target.value)}
                                        className="w-full bg-[#2C2C2E] border border-white/10 p-3 rounded-xl text-white font-medium focus:border-[#E60000] outline-none transition-colors appearance-none pr-10"
                                        required
                                    >
                                        <option value="" disabled>Wybierz zespół</option>
                                        {teams.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">
                                    Kolor (klasy CSS)
                                </label>
                                <input
                                    type="text"
                                    value={formColor}
                                    onChange={(e) => setFormColor(e.target.value)}
                                    placeholder="bg-blue-900 border-red-600"
                                    className="w-full bg-[#2C2C2E] border border-white/10 p-3 rounded-xl text-white placeholder-gray-600 font-medium focus:border-[#E60000] outline-none transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={formLoading}
                                className={clsx(
                                    "w-full bg-[#E60000] text-white p-4 rounded-xl font-black uppercase tracking-wider text-lg shadow-lg shadow-red-900/20 active:scale-95 transition-all mt-2",
                                    formLoading && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {formLoading
                                    ? "Zapisywanie..."
                                    : editingSlug
                                        ? "Zapisz zmiany"
                                        : "Dodaj kierowcę"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Drivers list grouped by team */}
            {dataLoading ? (
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#E60000]"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    {teams.map(team => {
                        const teamDrivers = drivers.filter(d => d.teamId === team.id);
                        if (teamDrivers.length === 0) return null;

                        return (
                            <div key={team.id} className="bg-[#1C1C1E] border border-white/5 rounded-2xl overflow-hidden">
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <h3 className="font-black text-white uppercase tracking-tight text-sm">{team.name}</h3>
                                    <span className="text-gray-600 text-xs font-bold ml-auto">{teamDrivers.length} kierowców</span>
                                </div>

                                <div className="divide-y divide-white/5">
                                    {teamDrivers.map(driver => (
                                        <div
                                            key={driver.slug}
                                            className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#2C2C2E] flex items-center justify-center font-black text-sm text-white">
                                                    {driver.number}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">{driver.name}</div>
                                                    <div className="text-gray-500 text-xs font-medium">
                                                        {driver.country} · {driver.slug}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditForm(driver)}
                                                    className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"
                                                    title="Edytuj"
                                                >
                                                    <Edit3 className="w-4 h-4 text-gray-400" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(driver.slug, driver.name)}
                                                    className="p-2.5 hover:bg-red-900/30 rounded-xl transition-colors"
                                                    title="Usuń"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
