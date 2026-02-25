"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTeamLogo } from "@/lib/data";
import { getTeams, getDrivers, addDriver, updateDriver, deleteDriver, getAllUsersWithVotes, deleteUser, getUserDetails } from "@/app/actions/admin";
import { getRaces, addRace, updateRace, deleteRace, seedRaces } from "@/app/actions/races";
import { toast } from "sonner";
import { Plus, Trash2, Edit3, X, Shield, Users, ChevronDown, Trophy, Flag, LogOut } from "lucide-react";
import { logoutUser } from "@/app/actions/auth";
import { clsx } from "clsx";
import ReactCountryFlag from "react-country-flag";


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
    active?: boolean;
    teamId: string;
    team: { name: string };
};

type UserRow = {
    id: string;
    name: string | null;
    username: string;
    isAdmin: boolean;
    team: string;
    votesCount: number;
    seasonVotesCount: number;
    createdAt: Date;
};

type UserDetails = {
    id: string;
    name: string | null;
    username: string;
    seasonVotes: { position: number; driver: string; team: string }[];
    raceVotes: { raceRound: string; driver: string; createdAt: Date }[];
};

type Race = {
    id: string;
    round: number;
    name: string;
    location: string;
    date: string | Date; // Can be string depending on serialization/parsing
    trackImage: string | null;
    country: string | null;
    circuitId: string | null;
};

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    // Data
    const [teams, setTeams] = useState<Team[]>([]);
    const [drivers, setDrivers] = useState<DriverRow[]>([]);
    const [users, setUsers] = useState<UserRow[]>([]);
    const [races, setRaces] = useState<Race[]>([]);
    
    // UI State
    const [activeTab, setActiveTab] = useState<"drivers" | "users" | "races">("drivers");
    const [showForm, setShowForm] = useState(false);
    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // Form state (Drivers)
    const [formSlug, setFormSlug] = useState("");
    const [formName, setFormName] = useState("");
    const [formNumber, setFormNumber] = useState("");
    const [formCountry, setFormCountry] = useState("");
    const [formTeamId, setFormTeamId] = useState("");
    const [formColor, setFormColor] = useState("");
    const [formActive, setFormActive] = useState(true);

    // Form state (Races)
    const [formRaceId, setFormRaceId] = useState<string | null>(null);
    const [formRaceRound, setFormRaceRound] = useState("");
    const [formRaceName, setFormRaceName] = useState("");
    const [formRaceLocation, setFormRaceLocation] = useState("");
    const [formRaceDate, setFormRaceDate] = useState("");
    const [formRaceTrackImage, setFormRaceTrackImage] = useState("");
    const [formRaceCountry, setFormRaceCountry] = useState("");

    // User details state
    const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        if (!loading && (!user || !user.isAdmin)) {
            router.replace("/calendar");
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
            const [teamsData, driversData, usersData, racesData] = await Promise.all([
                getTeams(), 
                getDrivers(),
                getAllUsersWithVotes(),
                getRaces()
            ]);
            setTeams(teamsData as Team[]);
            setDrivers(driversData as DriverRow[]);
            setUsers(usersData as UserRow[]);
            setRaces(racesData as unknown as Race[]);
        } catch (err) {
            toast.error("Nie udało się załadować danych");
        } finally {
            setDataLoading(false);
        }
    }

    function resetForm() {
        // Driver form reset
        setFormSlug("");
        setFormName("");
        setFormNumber("");
        setFormCountry("");
        setFormTeamId("");
        setFormColor("");
        setFormActive(true);
        setEditingSlug(null);
        
        // Race form reset
        setFormRaceId(null);
        setFormRaceRound("");
        setFormRaceName("");
        setFormRaceLocation("");
        setFormRaceDate("");
        setFormRaceTrackImage("");
        setFormRaceCountry("");

        setShowForm(false);
    }

    function openEditForm(driver: DriverRow) {
        setFormSlug(driver.slug);
        setFormName(driver.name);
        setFormNumber(String(driver.number));
        setFormCountry(driver.country || "");
        setFormTeamId(driver.teamId);
        setFormColor(driver.color || "");
        setFormActive(driver.active ?? true);
        setEditingSlug(driver.slug);
        setShowForm(true);
    }

    function openRaceForm(race?: Race) {
        resetForm();
        if (race) {
            setFormRaceId(race.id);
            setFormRaceRound(String(race.round));
            setFormRaceName(race.name);
            setFormRaceLocation(race.location);
            setFormRaceDate(new Date(race.date).toISOString().slice(0, 16)); // for datetime-local
            setFormRaceTrackImage(race.trackImage || "");
            setFormRaceCountry(race.country || "");
        }
        setShowForm(true);
    }

    async function handleRaceSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormLoading(true);

        try {
            const formData = new FormData();
            formData.append("round", formRaceRound);
            formData.append("name", formRaceName);
            formData.append("location", formRaceLocation);
            formData.append("date", formRaceDate);
            formData.append("trackImage", formRaceTrackImage);
            formData.append("country", formRaceCountry);

            let result;
            if (formRaceId) {
                formData.append("id", formRaceId);
                result = await updateRace(formData);
            } else {
                result = await addRace(formData);
            }

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success(formRaceId ? "Wyścig zaktualizowany" : "Wyścig dodany");
            resetForm();
            await loadData();
        } catch (e: any) {
            toast.error(e.message || "Błąd zapisu");
        } finally {
            setFormLoading(false);
        }
    }

    async function handleDeleteRace(id: string, name: string) {
        if (!confirm(`Usunąć wyścig ${name}?`)) return;
        try {
            const result = await deleteRace(id);
            if (result.success) {
                toast.success("Usunięto wyścig");
                await loadData();
            } else {
                toast.error(result.error);
            }
        } catch (e) {
            toast.error("Błąd usuwania");
        }
    }

    async function handleSeedRaces() {
        if (!confirm("Zaimportować wyścigi z pliku data.ts? To może nadpisać istniejące.")) return;
        setFormLoading(true);
        try {
            const result = await seedRaces();
            if (result.success) {
                toast.success("Zaimportowano wyścigi");
                await loadData();
            } else {
                toast.error(result.error);
            }
        } finally {
            setFormLoading(false);
        }
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
            formData.append("active", String(formActive));

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

    async function handleUserClick(userId: string) {
        setDetailsLoading(true);
        setSelectedUser(null);
        // Show modal immediately/loading state
        setShowForm(false); // Close other forms if open
        
        // We need to set some state to show modal, maybe reuse showForm or a new one?
        // Using selectedUser !== null as trigger for modal.
        // But we need to load first. 
        // Let's rely on detailsLoading to show a spinner in modal if we open it immediately?
        // Or just wait. Let's wait.
        
        try {
            const result = await getUserDetails(userId);
            if (result.error) {
                toast.error(result.error);
            } else {
                setSelectedUser(result.user as any); // Cast because of Date serialization over wire potentially
            }
        } catch (e) {
            toast.error("Błąd pobierania szczegółów");
        } finally {
            setDetailsLoading(false);
        }
    }

    async function handleDeleteUser(userId: string, username: string, e: React.MouseEvent) {
         e.stopPropagation();
         if (!confirm(`Usunąć użytkownika @${username}? Ta operacja jest nieodwracalna.`)) return;
         try {
             const result = await deleteUser(userId);
             if (result.success) {
                 toast.success(`Usunięto użytkownika @${username}`);
                 await loadData();
                 if (selectedUser?.id === userId) setSelectedUser(null);
             } else {
                 toast.error(result.error);
             }
         } catch (e) {
             toast.error("Błąd usuwania");
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
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-[#E60000] p-2.5 rounded-xl">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                            Panel <span className="text-[#E60000]">Admina</span>
                        </h1>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                            Zarządzanie
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => logoutUser()}
                    className="p-3 bg-[#1C1C1E] hover:bg-red-900/20 border border-white/10 hover:border-red-900/40 rounded-xl transition-all group"
                    title="Wyloguj się"
                >
                    <LogOut className="w-5 h-5 text-gray-500 group-hover:text-[#E60000] transition-colors" />
                </button>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Kierowcy</div>
                    <div className="text-3xl font-black text-white">{drivers.length}</div>
                </div>
                <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Użytkownicy</div>
                    <div className="text-3xl font-black text-white">{users.length}</div>
                </div>
                <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 hidden md:block">
                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Głosy</div>
                    <div className="text-3xl font-black text-white">
                        {users.reduce((acc, u) => acc + u.votesCount + u.seasonVotesCount, 0)}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-[#1C1C1E] rounded-xl mb-6 border border-white/5 w-full md:w-auto self-start inline-flex">
                <button
                    onClick={() => setActiveTab("drivers")}
                    className={clsx(
                        "flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all",
                        activeTab === "drivers" ? "bg-[#2C2C2E] text-white shadow" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    Kierowcy
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    className={clsx(
                        "flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all",
                        activeTab === "users" ? "bg-[#2C2C2E] text-white shadow" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    Użytkownicy
                </button>
                <button
                    onClick={() => setActiveTab("races")}
                    className={clsx(
                        "flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all",
                        activeTab === "races" ? "bg-[#2C2C2E] text-white shadow" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    Wyścigi
                </button>
            </div>

            {/* Content Content - Drivers */}
            {activeTab === "drivers" && (
                <>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="w-full flex items-center justify-center gap-3 p-4 bg-[#E60000] hover:bg-red-700 rounded-2xl font-black uppercase tracking-wider text-white transition-all active:scale-[0.98] mb-8 shadow-lg shadow-red-900/20"
                    >
                        <Plus className="w-5 h-5" />
                        Dodaj Kierowcę
                    </button>

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

                                    <div className="flex items-center gap-3 bg-[#2C2C2E] border border-white/10 p-3 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="activeCheck"
                                            checked={formActive}
                                            onChange={(e) => setFormActive(e.target.checked)}
                                            className="w-5 h-5 accent-[#E60000] rounded focus:ring-0 cursor-pointer"
                                        />
                                        <label htmlFor="activeCheck" className="text-white font-bold text-sm cursor-pointer select-none">
                                            Aktywny (widoczny w głosowaniach)
                                        </label>
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
                                            <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg p-1">
                                                <img src={getTeamLogo(team.name)} alt={team.name} className="w-full h-full object-contain" />
                                            </div>
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
                                                            <div className="text-gray-500 text-xs font-medium flex items-center gap-2">
                                                                {driver.country && (
                                                                    <ReactCountryFlag 
                                                                        countryCode={driver.country} 
                                                                        svg 
                                                                        style={{ width: "1.2em", height: "1.2em", borderRadius: "50%", objectFit: "cover" }} 
                                                                        aria-label={driver.country} 
                                                                    />
                                                                )}
                                                                <span>{driver.slug}</span>
                                                                {driver.active === false && (
                                                                    <span className="bg-red-900/40 text-red-300 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider border border-red-500/20">
                                                                        Nieaktywny
                                                                    </span>
                                                                )}
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
                </>
            )}

            {activeTab === "races" && (
                <>
                     <div className="flex gap-2 mb-8">
                         <button
                            onClick={() => { resetForm(); setShowForm(true); }}
                            className="flex-1 flex items-center justify-center gap-3 p-4 bg-[#E60000] hover:bg-red-700 rounded-2xl font-black uppercase tracking-wider text-white transition-all active:scale-[0.98] shadow-lg shadow-red-900/20"
                        >
                            <Plus className="w-5 h-5" />
                            Dodaj Wyścig
                        </button>
                        {races.length === 0 && (
                            <button
                                onClick={handleSeedRaces}
                                className="px-6 bg-[#2C2C2E] hover:bg-white/10 border border-white/10 rounded-2xl font-bold uppercase text-white transition-all"
                            >
                                Importuj Domyślne
                            </button>
                        )}
                     </div>

                    {showForm && (
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                            <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight">
                                        {formRaceId ? "Edytuj" : "Nowy"} <span className="text-[#E60000]">Wyścig</span>
                                    </h2>
                                    <button onClick={resetForm} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleRaceSubmit} className="space-y-4">
                                     <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">
                                            Runda *
                                        </label>
                                        <input
                                            type="number"
                                            value={formRaceRound}
                                            onChange={(e) => setFormRaceRound(e.target.value)}
                                            placeholder="1"
                                            className="w-full bg-[#2C2C2E] border border-white/10 p-3 rounded-xl text-white placeholder-gray-600 font-medium focus:border-[#E60000] outline-none transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">
                                            Nazwa *
                                        </label>
                                        <input
                                            type="text"
                                            value={formRaceName}
                                            onChange={(e) => setFormRaceName(e.target.value)}
                                            placeholder="Grand Prix Bahrajnu"
                                            className="w-full bg-[#2C2C2E] border border-white/10 p-3 rounded-xl text-white placeholder-gray-600 font-medium focus:border-[#E60000] outline-none transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">
                                            Data i Czas (UTC/Lokalny) *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={formRaceDate}
                                            onChange={(e) => setFormRaceDate(e.target.value)}
                                            className="w-full bg-[#2C2C2E] border border-white/10 p-3 rounded-xl text-white placeholder-gray-600 font-medium focus:border-[#E60000] outline-none transition-colors [color-scheme:dark]"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">
                                            Lokalizacja *
                                        </label>
                                        <input
                                            type="text"
                                            value={formRaceLocation}
                                            onChange={(e) => setFormRaceLocation(e.target.value)}
                                            placeholder="Sakhir"
                                            className="w-full bg-[#2C2C2E] border border-white/10 p-3 rounded-xl text-white placeholder-gray-600 font-medium focus:border-[#E60000] outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    
                                     <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">
                                            Track Image URL (Optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={formRaceTrackImage}
                                            onChange={(e) => setFormRaceTrackImage(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full bg-[#2C2C2E] border border-white/10 p-3 rounded-xl text-white placeholder-gray-600 font-medium focus:border-[#E60000] outline-none transition-colors"
                                        />
                                    </div>

                                     <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1 block">
                                            Kraj (Opcjonalne)
                                        </label>
                                        <input
                                            type="text"
                                            value={formRaceCountry}
                                            onChange={(e) => setFormRaceCountry(e.target.value)}
                                            placeholder="Bahrain"
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
                                            : formRaceId
                                                ? "Zapisz zmiany"
                                                : "Dodaj wyścig"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {races.map(race => (
                             <div key={race.id} className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 hover:bg-[#252528] transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                         <div className="w-12 h-12 bg-[#2C2C2E] rounded-xl flex flex-col items-center justify-center border border-white/5">
                                            <span className="text-[8px] uppercase text-gray-500 font-bold">Runda</span>
                                            <span className="text-xl font-black text-white">{race.round}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{race.name}</h3>
                                            <div className="text-gray-500 text-xs font-medium flex items-center gap-2">
                                                <span>{race.location}</span>
                                                <span>·</span>
                                                <span className={new Date(race.date) < new Date() ? "text-gray-600" : "text-[#E60000] font-bold"}>
                                                    {new Date(race.date).toLocaleDateString()} {new Date(race.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {race.trackImage ? (
                                             <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-500/20 font-bold uppercase tracking-wider">
                                                 Mapa OK
                                             </span>
                                        ) : (
                                            <span className="text-[10px] bg-gray-800 text-gray-500 px-2 py-1 rounded border border-white/10 font-bold uppercase tracking-wider">
                                                 Brak Mapy
                                             </span>
                                        )}
                                        <div className="flex items-center gap-1">
                                             <button
                                                onClick={() => openRaceForm(race)}
                                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                                title="Edytuj"
                                            >
                                                <Edit3 className="w-4 h-4 text-gray-400" />
                                            </button>
                                             <button
                                                onClick={() => handleDeleteRace(race.id, race.name)}
                                                className="p-2 hover:bg-red-900/30 rounded-xl transition-colors"
                                                title="Usuń"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        ))}
                    </div>
                </>
            )}

            {/* Content Content - Users */}
            {activeTab === "users" && (
                <div className="space-y-4">
                    {/* User Details Modal */}
                    {(selectedUser || detailsLoading) && (
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                            <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight">
                                        Szczegóły <span className="text-[#E60000]">Użytkownika</span>
                                    </h2>
                                    <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                {detailsLoading ? (
                                    <div className="flex justify-center p-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#E60000]"></div>
                                    </div>
                                ) : selectedUser && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                            <div className="w-16 h-16 rounded-full bg-[#2C2C2E] flex items-center justify-center font-black text-2xl text-gray-500">
                                                {selectedUser.name?.[0] || "U"}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">{selectedUser.name || "Anonim"}</h3>
                                                <p className="text-gray-500 font-medium">@{selectedUser.username}</p>
                                            </div>
                                        </div>

                                        {/* Season Votes */}
                                        <div>
                                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Trophy className="w-4 h-4 text-[#E60000]" />
                                                Typy Sezonowe ({selectedUser.seasonVotes.length})
                                            </h4>
                                            {selectedUser.seasonVotes.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {selectedUser.seasonVotes.map((vote) => (
                                                        <div key={vote.position} className="flex items-center gap-3 bg-white/[0.03] p-2 rounded-xl">
                                                            <div className="w-8 h-8 rounded-lg bg-[#2C2C2E] flex items-center justify-center font-black text-white text-sm">
                                                                {vote.position}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-white">{vote.driver}</div>
                                                                <div className="text-[10px] text-gray-500 uppercase">{vote.team}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-600 text-sm italic">Brak typów na sezon.</p>
                                            )}
                                        </div>

                                        {/* Race Votes */}
                                        <div>
                                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Flag className="w-4 h-4 text-white" />
                                                Ostatnie Głosy ({selectedUser.raceVotes.length})
                                            </h4>
                                            {selectedUser.raceVotes.length > 0 ? (
                                                <div className="space-y-2">
                                                    {selectedUser.raceVotes.map((vote, idx) => (
                                                        <div key={idx} className="flex items-center justify-between bg-white/[0.03] p-3 rounded-xl">
                                                            <div>
                                                                <div className="text-xs text-gray-500 font-bold uppercase mb-1">
                                                                    {vote.raceRound}
                                                                </div>
                                                                <div className="text-sm font-bold text-white">{vote.driver}</div>
                                                            </div>
                                                            <div className="text-[10px] text-gray-600">
                                                                {new Date(vote.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-600 text-sm italic">Brak głosów na wyścigi.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {users.map(userRow => (
                        <div 
                            key={userRow.id} 
                            onClick={() => handleUserClick(userRow.id)}
                            className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 hover:bg-[#252528] transition-colors cursor-pointer group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={clsx(
                                        "w-12 h-12 rounded-full flex items-center justify-center font-black text-lg border-2",
                                        userRow.isAdmin ? "bg-red-900/20 text-[#E60000] border-[#E60000]" : "bg-[#2C2C2E] text-gray-400 border-transparent"
                                    )}>
                                        {userRow.isAdmin ? <Shield className="w-5 h-5" /> : (userRow.name?.[0] || "U")}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-white text-lg group-hover:text-[#E60000] transition-colors">{userRow.name || "Anonim"}</h3>
                                            {userRow.isAdmin && (
                                                <span className="bg-[#E60000] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ADMIN</span>
                                            )}
                                        </div>
                                        <div className="text-gray-500 text-xs font-medium">@{userRow.username} · {userRow.team}</div>
                                    </div>
                                </div>
                                <div className="text-right flex items-start gap-4">
                                    <div className="flex flex-col gap-1 items-end">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-wider">
                                            <Trophy className="w-3 h-3 text-[#E60000]" />
                                            <span className="text-white">{userRow.seasonVotesCount}</span>
                                            <span className="opacity-50">Sezon</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-wider">
                                            <Flag className="w-3 h-3 text-white" />
                                            <span className="text-white">{userRow.votesCount}</span>
                                            <span className="opacity-50">Wyścig</span>
                                        </div>
                                    </div>
                                    
                                    {!userRow.isAdmin && (
                                        <button 
                                            onClick={(e) => handleDeleteUser(userRow.id, userRow.username, e)}
                                            className="p-2 hover:bg-red-900/30 rounded-lg text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Usuń użytkownika"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
