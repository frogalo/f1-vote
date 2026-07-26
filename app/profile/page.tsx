"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { logoutUser, updateProfile } from "@/app/actions/auth";
import { getProfileOptions } from "@/app/actions/profile";
import {
    User,
    LogOut,
    Edit3,
    Check,
    X,
    ChevronDown,
    Camera,
    GripVertical,
    Plus,
    Trophy,
    Star,
    ArrowUpDown,
    Zap,
    Timer,
    Wrench,
    AlertTriangle,
    Flame,
    CloudRain,
    Lock
} from "lucide-react";
import { getTeamLogo, normalizeCountryCode } from "@/lib/data";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Resizer from "react-image-file-resizer";
import ReactCountryFlag from "react-country-flag";
import { clsx } from "clsx";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    getSeasonVotes,
    getAvailableDrivers,
    addSeasonVote,
    removeSeasonVote,
    reorderSeasonVotes,
    isSeasonLocked,
    getAvailableTeams,
    getSeasonExtras,
    setSeasonExtraLap,
    setSeasonExtraPitstop,
    setSeasonExtraMostDotd,
    setSeasonExtraMostDnf,
    setSeasonExtraFirstRaceCollision,
    setSeasonExtraFirstRaceRain,
} from "@/app/actions/seasonVote";

type Team = { id: string; name: string };
type DriverOption = { slug: string; name: string; number: number; team: { name: string } };

type DriverInfo = {
    slug: string;
    name: string;
    number: number;
    country: string | null;
    color: string | null;
    team: string;
};

type PickedDriver = DriverInfo & { position: number };

// ─── Custom Select Component ───────────────────────────────────────────────
function CustomSelect({
    label,
    value,
    options,
    placeholder,
    disabled,
    onChange
}: {
    label: string;
    value: string;
    options: { value: string; label: React.ReactNode; filterText?: string }[];
    placeholder: string;
    disabled?: boolean;
    onChange: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div ref={ref} className="flex flex-col gap-1.5 relative">
            {label && <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</label>}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(!open)}
                className={clsx(
                    "w-full bg-white/[0.03] border border-transparent p-3 rounded-xl text-sm font-medium text-left flex items-center justify-between transition-colors outline-none",
                    selectedOption ? "text-white" : "text-gray-500",
                    open && "bg-white/[0.06] ring-1 ring-[#E60000]/30",
                    disabled && "opacity-50 cursor-not-allowed",
                    !disabled && "hover:bg-white/[0.06]"
                )}
            >
                <span className="flex-1 truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown className={clsx("w-4 h-4 transition-transform flex-shrink-0 ml-2", selectedOption ? "text-white/50" : "text-gray-500", open && "rotate-180")} />
            </button>

            {open && !disabled && (
                <div className="absolute actions-select-dropdown z-50 top-full mt-1.5 left-0 right-0 bg-[#1C1C1E] border border-white/10 rounded-xl shadow-2xl overflow-y-auto overflow-hidden" style={{ maxHeight: "250px" }}>
                    {options.map(o => (
                        <button
                            key={o.value}
                            type="button"
                            onClick={() => {
                                onChange(o.value);
                                setOpen(false);
                            }}
                            className={clsx(
                                "w-full flex items-center gap-2 px-3 py-3 text-left hover:bg-white/5 hover:text-white transition-colors text-sm",
                                value === o.value ? "text-[#E60000] bg-[#E60000]/10 font-bold" : "text-gray-300"
                            )}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Shared driver card ────────────────────────────────────────────────────
function DriverCard({
    driver,
    index,
    locked,
    mobile,
    isSelected,
    isSwapTarget,
    isDragging,
    dragHandleProps,
    onRemove,
    onTapBadge,
}: {
    driver: PickedDriver;
    index: number;
    locked: boolean;
    mobile?: boolean;
    isSelected?: boolean;
    isSwapTarget?: boolean;
    isDragging?: boolean;
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
    onRemove: (slug: string) => void;
    onTapBadge?: () => void;
}) {
    const isChampion = index === 0;
    const isPodium = index < 3;

    return (
        <Card
            className={clsx(
                "border-white/[0.06] bg-[#1C1C1E] overflow-hidden transition-all duration-200 select-none",
                isDragging && "opacity-60 scale-[1.02] shadow-2xl z-50",
                isChampion && "ring-1 ring-yellow-500/20",
                isSelected && "ring-2 ring-[#E60000] scale-[1.01]",
                isSwapTarget && !locked && "ring-2 ring-white/20"
            )}
        >
            <CardContent className="flex items-center gap-3 p-3">
                {/* Position badge — tappable on mobile */}
                {mobile ? (
                    <button
                        onClick={onTapBadge}
                        disabled={locked}
                        aria-label={`Pozycja ${index + 1}`}
                        className={clsx(
                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                            "font-black text-lg transition-all duration-200 active:scale-90 focus:outline-none",
                            locked
                                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                                : isSelected
                                ? "bg-[#E60000] text-white shadow-lg shadow-red-600/40 scale-110"
                                : isSwapTarget
                                ? "bg-white/10 text-white ring-1 ring-white/30"
                                : isPodium
                                ? "bg-[#E60000]/20 text-[#E60000]"
                                : "bg-secondary text-muted-foreground"
                        )}
                    >
                        {isSelected
                            ? <ArrowUpDown className="w-4 h-4" />
                            : isChampion
                            ? <Star className="w-4 h-4" />
                            : index + 1}
                    </button>
                ) : (
                    <div
                        className={clsx(
                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-lg",
                            isPodium ? "bg-[#E60000]/20 text-[#E60000]" : "bg-secondary text-muted-foreground"
                        )}
                    >
                        {isChampion ? <Star className="w-4 h-4" /> : index + 1}
                    </div>
                )}

                {/* Driver number */}
                <span className="text-sm font-bold w-8 text-muted-foreground flex-shrink-0">
                    #{driver.number}
                </span>

                {/* Driver info */}
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-foreground flex flex-wrap items-center gap-2">
                        {driver.country && (
                            <ReactCountryFlag
                                countryCode={normalizeCountryCode(driver.country)}
                                svg
                                style={{ width: "1.1em", height: "1.1em", borderRadius: "50%", objectFit: "cover" }}
                                aria-label={driver.country}
                            />
                        )}
                        <span className={clsx(isChampion && "text-yellow-400")}>{driver.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getTeamLogo(driver.team)} alt={driver.team} className="w-3.5 h-3.5 object-contain" />
                        <span className="text-[10px] text-muted-foreground uppercase font-medium">
                            {driver.team}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                {!locked && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(driver.slug); }}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-white/5 rounded-lg transition-all"
                            aria-label="Usuń kierowcę"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Drag handle — desktop only */}
                        {!mobile && (
                            <div
                                {...dragHandleProps}
                                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all cursor-grab active:cursor-grabbing touch-none"
                                aria-label="Przeciągnij, aby zmienić kolejność"
                            >
                                <GripVertical className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ─── Sortable wrapper (desktop) ────────────────────────────────────────────
function SortableDriverItem({
    driver, index, locked, onRemove,
}: {
    driver: PickedDriver; index: number; locked: boolean; onRemove: (slug: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: driver.slug, disabled: locked });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition ?? "transform 200ms cubic-bezier(0.25,1,0.5,1)",
            }}
        >
            <DriverCard
                driver={driver}
                index={index}
                locked={locked}
                isDragging={isDragging}
                dragHandleProps={{ ...attributes, ...listeners }}
                onRemove={onRemove}
            />
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function ProfilePage() {
    const { user, loading: authLoading, refreshUser } = useAuth();
    const router = useRouter();

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"profile" | "standings" | "extras">("profile");
    const [hasDefaultedTab, setHasDefaultedTab] = useState(false);

    // Profile fields
    const [name, setName] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedDriver, setSelectedDriver] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

    // Dropdown options from DB
    const [teams, setTeams] = useState<Team[]>([]);
    const [drivers, setDrivers] = useState<DriverOption[]>([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);

    // Season predictions data state
    const [loadingSeason, setLoadingSeason] = useState(true);
    const [locked, setLocked] = useState(false);
    const [pickedDrivers, setPickedDrivers] = useState<PickedDriver[]>([]);
    const [allDrivers, setAllDrivers] = useState<DriverInfo[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [timeLeft, setTimeLeft] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

    const [allTeams, setAllTeams] = useState<{ id: string, name: string }[]>([]);
    const [fastestLapDriverId, setFastestLapDriverId] = useState<string | null>(null);
    const [fastestPitstopTeamId, setFastestPitstopTeamId] = useState<string | null>(null);
    const [mostDotdDriverId, setMostDotdDriverId] = useState<string | null>(null);
    const [mostDnfRange, setMostDnfRange] = useState<string | null>(null);
    const [firstRaceCollision, setFirstRaceCollision] = useState<boolean | null>(null);
    const [firstRaceRain, setFirstRaceRain] = useState<boolean | null>(null);

    // Screen-width based mobile detection
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Desktop sensors for drag and drop
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Sync form state when user loads
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setSelectedTeam(user.team || "");
            setSelectedDriver(user.favoriteDriverSlug || "");
        }
    }, [user]);

    // Load profile options when editing starts
    useEffect(() => {
        if (editing && !optionsLoaded) {
            getProfileOptions().then(({ teams, drivers }) => {
                setTeams(teams);
                setDrivers(drivers);
                setOptionsLoaded(true);
            });
        }
    }, [editing, optionsLoaded]);

    // Load season predictions data
    useEffect(() => {
        async function loadSeasonData() {
            try {
                const [lockStatus, votes, driversData, teamsData, extras] = await Promise.all([
                    isSeasonLocked(),
                    getSeasonVotes(),
                    getAvailableDrivers(),
                    getAvailableTeams(),
                    getSeasonExtras(),
                ]);
                setLocked(lockStatus);
                setAllDrivers(driversData);
                setAllTeams(teamsData);
                if (extras) {
                    setFastestLapDriverId(extras.fastestLapDriverId);
                    setFastestPitstopTeamId(extras.fastestPitstopTeamId);
                    setMostDotdDriverId(extras.mostDotdDriverId);
                    setMostDnfRange(extras.mostDnfRange);
                    setFirstRaceCollision(extras.firstRaceCollision);
                    setFirstRaceRain(extras.firstRaceRain);
                }
                setPickedDrivers(
                    votes.map((v) => ({
                        slug: v.driverSlug,
                        name: v.driverName,
                        number: v.driverNumber,
                        country: v.driverCountry,
                        color: v.driverColor,
                        team: v.team,
                        position: v.position,
                    }))
                );
            } catch (error) {
                console.error("Failed to load season data", error);
            } finally {
                setLoadingSeason(false);
            }
        }
        if (!authLoading && user) loadSeasonData();
    }, [authLoading, user]);

    // Default active tab based on completion
    useEffect(() => {
        if (!authLoading && !loadingSeason && user && allDrivers.length > 0 && !hasDefaultedTab) {
            const standingsDone = pickedDrivers.length === allDrivers.length;
            const extrasDone = !!fastestLapDriverId && !!fastestPitstopTeamId && !!mostDotdDriverId && !!mostDnfRange && firstRaceCollision !== null && firstRaceRain !== null;

            if (!standingsDone) {
                setActiveTab("standings");
            } else if (!extrasDone) {
                setActiveTab("extras");
            }
            setHasDefaultedTab(true);
        }
    }, [authLoading, loadingSeason, user, allDrivers, pickedDrivers, fastestLapDriverId, fastestPitstopTeamId, mostDotdDriverId, mostDnfRange, firstRaceCollision, firstRaceRain, hasDefaultedTab]);

    // Countdown
    useEffect(() => {
        const firstRaceDate = new Date("2026-03-08T05:00:00Z");
        const update = () => {
            const diff = firstRaceDate.getTime() - Date.now();
            if (diff <= 0) {
                if (user?.unlockedSeason) {
                    setTimeLeft("OTWARTE");
                    setLocked(false);
                } else {
                    setTimeLeft("ZABLOKOWANE");
                    setLocked(true);
                }
                return;
            }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            setTimeLeft(`${d}d ${h}h ${m}m`);
        };
        update();
        const id = setInterval(update, 60000);
        return () => clearInterval(id);
    }, [user?.unlockedSeason]);

    // Redirect admins
    useEffect(() => {
        if (!authLoading && user?.isAdmin) {
            router.push("/admin");
        }
    }, [user, authLoading, router]);

    const handleSaveProfile = async () => {
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

    const handleCancelProfile = () => {
        if (user) {
            setName(user.name || "");
            setSelectedTeam(user.team || "");
            setSelectedDriver(user.favoriteDriverSlug || "");
        }
        setAvatarFile(null);
        setPreviewAvatar(null);
        setEditing(false);
    };

    // ─── Add driver ─────────────────────────────────────────────────
    const handleAddDriver = async (driver: DriverInfo) => {
        if (locked || saving) return;
        setSaving(true);
        const newPosition = pickedDrivers.length + 1;
        const newPicked: PickedDriver = { ...driver, position: newPosition };
        setPickedDrivers((prev) => [...prev, newPicked]);
        try {
            const result = await addSeasonVote(driver.slug);
            if (result.error) {
                setPickedDrivers((prev) => prev.filter((d) => d.slug !== driver.slug));
                toast.error(result.error);
            } else {
                if (newPosition === 1) toast.success(`MISTRZ: ${driver.name}!`);
                if (newPosition === allDrivers.length) {
                    router.refresh();
                }
            }
        } catch {
            setPickedDrivers((prev) => prev.filter((d) => d.slug !== driver.slug));
            toast.error("Błąd podczas dodawania");
        } finally {
            setSaving(false);
            refreshUser();
        }
    };

    // ─── Remove driver ──────────────────────────────────────────────
    const handleRemoveDriver = async (slug: string) => {
        if (locked || saving) return;
        setSaving(true);
        const backup = [...pickedDrivers];
        setSelectedSlug(null);
        setPickedDrivers((prev) =>
            prev.filter((d) => d.slug !== slug).map((d, i) => ({ ...d, position: i + 1 }))
        );
        try {
            const result = await removeSeasonVote(slug);
            if (result.error) { setPickedDrivers(backup); toast.error(result.error); }
            else if (backup.length === allDrivers.length) {
                router.refresh();
            }
        } catch {
            setPickedDrivers(backup);
            toast.error("Błąd podczas usuwania");
        } finally {
            setSaving(false);
            refreshUser();
        }
    };

    // ─── Desktop drag reorder ────────────────────────────────────────
    const handleDragEnd = async (event: DragEndEvent) => {
        if (locked || saving) return;
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIdx = pickedDrivers.findIndex((d) => d.slug === active.id);
            const newIdx = pickedDrivers.findIndex((d) => d.slug === over.id);
            const newOrder = arrayMove(pickedDrivers, oldIdx, newIdx).map((d, i) => ({ ...d, position: i + 1 }));
            const backup = [...pickedDrivers];
            setPickedDrivers(newOrder);
            setSaving(true);
            try {
                const result = await reorderSeasonVotes(newOrder.map((d) => d.slug));
                if (result.error) { setPickedDrivers(backup); toast.error(result.error); }
            } catch {
                setPickedDrivers(backup);
                toast.error("Błąd podczas zmiany kolejności");
            } finally {
                setSaving(false);
            }
        }
    };

    // ─── Mobile tap-to-swap ──────────────────────────────────────────
    const handleTapBadge = async (slug: string) => {
        if (locked || saving) return;
        if (!selectedSlug) { setSelectedSlug(slug); return; }
        if (selectedSlug === slug) { setSelectedSlug(null); return; }

        const idxA = pickedDrivers.findIndex((d) => d.slug === selectedSlug);
        const idxB = pickedDrivers.findIndex((d) => d.slug === slug);
        if (idxA === -1 || idxB === -1) { setSelectedSlug(null); return; }

        const next = [...pickedDrivers];
        [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
        const reordered = next.map((d, i) => ({ ...d, position: i + 1 }));
        const backup = [...pickedDrivers];
        setPickedDrivers(reordered);
        setSelectedSlug(null);
        setSaving(true);

        try {
            const result = await reorderSeasonVotes(reordered.map((d) => d.slug));
            if (result.error) { setPickedDrivers(backup); toast.error(result.error); }
            else toast.success("Pozycje zamienione!");
        } catch {
            setPickedDrivers(backup);
            toast.error("Błąd podczas zamiany");
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loadingSeason) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#E60000]"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-500 mb-4">Nie jesteś zalogowany.</p>
            </div>
        );
    }

    // Season statistics & helpers
    const progress = allDrivers.length > 0 ? (pickedDrivers.length / allDrivers.length) * 100 : 0;
    const pickedSlugs = new Set(pickedDrivers.map((d) => d.slug));
    const availableDrivers = allDrivers.filter((d) => !pickedSlugs.has(d.slug));
    const filteredAvailable = searchQuery
        ? availableDrivers.filter(
            (d) =>
                d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(d.number).includes(searchQuery)
        )
        : availableDrivers;

    const completedExtrasCount = [
        fastestLapDriverId,
        fastestPitstopTeamId,
        mostDotdDriverId,
        mostDnfRange,
        firstRaceCollision,
        firstRaceRain
    ].filter(val => val !== null && val !== "").length;

    const isStandingsComplete = pickedDrivers.length === allDrivers.length;
    const isExtrasComplete = completedExtrasCount === 6;
    const isSeasonPicksComplete = isStandingsComplete && isExtrasComplete;

    // Custom select options
    const driverOptions = allDrivers.map(d => ({
        value: d.slug,
        label: (
            <div className="flex items-center gap-2 truncate">
                <span className="truncate">{d.name}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getTeamLogo(d.team)} alt={d.team} className="w-3.5 h-3.5 object-contain flex-shrink-0" />
                <span className="text-[10px] text-muted-foreground uppercase shrink-0">{d.team}</span>
            </div>
        )
    }));

    const teamOptions = allTeams.map(t => ({
        value: t.id,
        label: (
            <div className="flex items-center gap-2 truncate">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getTeamLogo(t.name)} alt={t.name} className="w-4 h-4 object-contain flex-shrink-0" />
                <span className="truncate">{t.name}</span>
            </div>
        )
    }));

    const dnfOptions = ["0-2", "3-5", "6-8", "9-11", "12+"].map(o => ({
        value: o,
        label: <span className="font-medium">{o}</span>
    }));

    const yesNoOptions = [
        { value: "true", label: <span className="font-medium text-green-500">Tak</span> },
        { value: "false", label: <span className="font-medium text-[#E60000]">Nie</span> }
    ];

    const hintText = isMobile
        ? selectedSlug
            ? "👆 Dotknij numer pozycji, aby zamienić miejsca"
            : "👆 Dotknij numer pozycji, aby wybrać kierowcę"
        : "Przeciągnij ⠿, aby zmienić kolejność";

    return (
        <div className="pb-32 pt-8 px-4">
            {/* Completion Warning Banner */}
            {!isSeasonPicksComplete && !locked && (
                <div className="mb-6 p-4 rounded-2xl bg-[#E60000]/10 border border-[#E60000]/20 flex items-center gap-3 animate-pulse">
                    <Trophy className="w-6 h-6 text-[#E60000] shrink-0" />
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight">Dokończ typowanie sezonu!</h4>
                        <p className="text-xs text-gray-400">
                            Musisz wybrać {allDrivers.length} kierowców i odpowiedzieć na 6 pytań dodatkowych, aby odblokować resztę aplikacji.
                        </p>
                    </div>
                </div>
            )}

            {/* Header Area */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                    {activeTab === "profile" ? "Profil" : "Typowanie Sezonu"}
                </h1>
                {activeTab === "profile" && (
                    !editing ? (
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
                                onClick={handleCancelProfile}
                                className="flex items-center gap-1 px-3 py-2 bg-[#1C1C1E] hover:bg-[#2C2C2E] border border-white/10 rounded-xl text-sm font-bold text-gray-400 transition-all active:scale-95"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="flex items-center gap-1 px-4 py-2 bg-[#E60000] hover:bg-red-700 border border-red-500 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Check className="w-4 h-4" />
                                {saving ? "..." : "Zapisz"}
                            </button>
                        </div>
                    )
                )}
                {activeTab !== "profile" && (
                    <div className="flex items-center gap-2">
                        <Badge
                            className={clsx(
                                "text-xs font-bold py-1 px-2.5",
                                locked
                                    ? "bg-[#E60000] text-white border-[#E60000]"
                                    : "bg-[#E60000]/10 text-[#E60000] border-[#E60000]/20"
                            )}
                            variant="outline"
                        >
                            {locked ? <Lock className="w-3 h-3 mr-1 inline" /> : "⏰ "}{timeLeft || "..."}
                        </Badge>
                        {!locked && saving && (
                            <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full animate-pulse shadow-[0_0_8px_#E60000]" />
                        )}
                    </div>
                )}
            </div>

            {/* Custom Premium Pill Tabs */}
            <div className="flex bg-[#1C1C1E]/80 backdrop-blur-md p-1 rounded-2xl border border-white/5 mb-8">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={clsx(
                        "flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300",
                        activeTab === "profile"
                            ? "bg-white/[0.07] text-white border-b-2 border-[#E60000]"
                            : "text-gray-400 hover:text-white"
                    )}
                >
                    Ustawienia
                </button>
                <button
                    onClick={() => setActiveTab("standings")}
                    className={clsx(
                        "flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5",
                        activeTab === "standings"
                            ? "bg-white/[0.07] text-white border-b-2 border-[#E60000]"
                            : "text-gray-400 hover:text-white"
                    )}
                >
                    Mistrzostwa
                </button>
                <button
                    onClick={() => setActiveTab("extras")}
                    className={clsx(
                        "flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5",
                        activeTab === "extras"
                            ? "bg-white/[0.07] text-white border-b-2 border-[#E60000]"
                            : "text-gray-400 hover:text-white"
                    )}
                >
                    Pytania
                </button>
            </div>

            {/* ──────── TABS CONTENT ──────── */}

            {/* TAB 1: Profile Details */}
            {activeTab === "profile" && (
                <div className="space-y-6">
                    {/* Avatar & Name Card */}
                    <div className="bg-[#1C1C1E] rounded-[2rem] p-8 border border-white/5 text-center">
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
                    <div className="space-y-4">
                        {/* Team */}
                        <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5">
                            <div className="text-gray-500 text-[10px] uppercase font-bold mb-3 tracking-wider">Ulubiony zespół</div>
                            {editing ? (
                                <div className="relative">
                                    <select
                                        value={selectedTeam}
                                        onChange={e => setSelectedTeam(e.target.value)}
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
                                        {drivers.map(d => (
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
                    <div className="mt-8">
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
            )}

            {/* TAB 2: Season standings picks */}
            {activeTab === "standings" && (
                <div className="space-y-6">
                    {/* Standings progress bar */}
                    {!locked && (
                        <div className="bg-[#1C1C1E] p-4 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-400">Postęp klasyfikacji</span>
                                <span className="text-xs font-black text-[#E60000]">{pickedDrivers.length} / {allDrivers.length}</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#E60000] to-red-400 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2 text-center font-bold">
                                {locked ? "Typowanie zamknięte" : hintText}
                            </p>
                        </div>
                    )}

                    {/* Picked driver list */}
                    <div>
                        {pickedDrivers.length > 0 ? (
                            <div className="space-y-2">
                                {isMobile ? (
                                    /* Mobile: tap-to-swap */
                                    pickedDrivers.map((driver, index) => (
                                        <DriverCard
                                            key={driver.slug}
                                            driver={driver}
                                            index={index}
                                            locked={locked}
                                            mobile
                                            isSelected={selectedSlug === driver.slug}
                                            isSwapTarget={selectedSlug !== null && selectedSlug !== driver.slug}
                                            onRemove={handleRemoveDriver}
                                            onTapBadge={() => handleTapBadge(driver.slug)}
                                        />
                                    ))
                                ) : (
                                    /* Desktop: drag-and-drop */
                                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                        <SortableContext items={pickedDrivers.map((d) => d.slug)} strategy={verticalListSortingStrategy}>
                                            {pickedDrivers.map((driver, index) => (
                                                <SortableDriverItem
                                                    key={driver.slug}
                                                    driver={driver}
                                                    index={index}
                                                    locked={locked}
                                                    onRemove={handleRemoveDriver}
                                                />
                                            ))}
                                        </SortableContext>
                                    </DndContext>
                                )}

                                {/* Ghost slots */}
                                {!locked && pickedDrivers.length < allDrivers.length && (
                                    <div className="space-y-2 opacity-20 mt-2">
                                        {[...Array(Math.min(3, allDrivers.length - pickedDrivers.length))].map((_, i) => (
                                            <div key={i} className="flex items-center p-3 rounded-2xl border border-dashed border-border h-16">
                                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mr-3 font-black text-xl text-muted-foreground">
                                                    {pickedDrivers.length + i + 1}
                                                </div>
                                                <div className="h-4 w-24 bg-border rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-16 flex flex-col items-center justify-center text-center px-8 border-2 border-dashed border-border rounded-3xl">
                                <Trophy className="w-14 h-14 text-muted-foreground/30 mb-6" />
                                <h2 className="text-xl font-bold text-foreground mb-2 uppercase">Kto zostanie mistrzem?</h2>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Wybierz swojego faworyta z listy poniżej.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Bottom drawer — available drivers */}
                    {!locked && (
                        availableDrivers.length > 0 ? (
                            <div className="bg-card border border-border p-4 rounded-3xl shadow-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                                        DOSTĘPNI ({availableDrivers.length})
                                    </p>
                                    {availableDrivers.length > 8 && (
                                        <input
                                            type="text"
                                            placeholder="Szukaj..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-background border border-border rounded-full px-3 py-1 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#E60000] w-28 md:w-52 transition-all"
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {filteredAvailable.map((driver) => (
                                        <button
                                            key={driver.slug}
                                            onClick={() => handleAddDriver(driver)}
                                            disabled={saving}
                                            className={clsx(
                                                "flex items-center gap-2 p-2.5 rounded-xl border border-border bg-background",
                                                "hover:bg-accent hover:border-[#E60000]/30 active:scale-95 transition-all text-left group",
                                                saving && "opacity-50 pointer-events-none"
                                            )}
                                        >
                                            <div className="flex-1 min-w-0 pr-2">
                                                <div className="font-bold text-sm text-foreground group-hover:text-foreground break-words">
                                                    {driver.name}
                                                </div>
                                                <div className="text-[9px] text-muted-foreground uppercase font-bold break-words">
                                                    {driver.team}
                                                </div>
                                            </div>
                                            <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[#E60000] flex-shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-card border border-border rounded-3xl p-6 text-center">
                                <div className="text-[#E60000] font-black text-xs uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                                    <Trophy className="w-4 h-4" /> Stawka kompletna
                                </div>
                                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                                    {isMobile ? "Dotknij numery pozycji, aby zmieniać kolejność." : "Przeciągnij ⠿, aby zmieniać kolejność."}
                                </p>
                            </div>
                        )
                    )}

                    {locked && (
                        <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] px-4 py-3 border border-white/5">
                            <Lock className="h-4 w-4 shrink-0 text-gray-500" />
                            <span className="text-xs font-bold text-gray-500">
                                Typowanie zostało zamknięte — nie możesz już zmieniać odpowiedzi.
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: Season extras predictions */}
            {activeTab === "extras" && (
                <div className="space-y-6">
                    {/* Prediction cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {[
                            {
                                icon: <Timer className="h-4 w-4 text-purple-400" />,
                                label: "Najszybsze okrążenie",
                                sublabel: "Kierowca",
                                placeholder: "Wybierz kierowcę...",
                                value: fastestLapDriverId || "",
                                options: driverOptions,
                                color: "purple",
                                onChange: async (val: string) => {
                                    setFastestLapDriverId(val);
                                    setSaving(true);
                                    await setSeasonExtraLap(val);
                                    setSaving(false);
                                    refreshUser();
                                    router.refresh();
                                },
                            },
                            {
                                icon: <Wrench className="h-4 w-4 text-orange-400" />,
                                label: "Najszybszy pitstop",
                                sublabel: "Zespół",
                                placeholder: "Wybierz zespół...",
                                value: fastestPitstopTeamId || "",
                                options: teamOptions,
                                color: "orange",
                                onChange: async (val: string) => {
                                    setFastestPitstopTeamId(val);
                                    setSaving(true);
                                    await setSeasonExtraPitstop(val);
                                    setSaving(false);
                                    refreshUser();
                                    router.refresh();
                                },
                            },
                            {
                                icon: <Star className="h-4 w-4 text-yellow-400" />,
                                label: "Najwięcej Driver of the Day",
                                sublabel: "Kierowca",
                                placeholder: "Wybierz kierowcę...",
                                value: mostDotdDriverId || "",
                                options: driverOptions,
                                color: "yellow",
                                onChange: async (val: string) => {
                                    setMostDotdDriverId(val);
                                    setSaving(true);
                                    await setSeasonExtraMostDotd(val);
                                    setSaving(false);
                                    refreshUser();
                                    router.refresh();
                                },
                            },
                            {
                                icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
                                label: "Najwięcej DNF",
                                sublabel: "W sezonie",
                                placeholder: "Przedział wyścigów",
                                value: mostDnfRange || "",
                                options: dnfOptions,
                                color: "red",
                                onChange: async (val: string) => {
                                    setMostDnfRange(val);
                                    setSaving(true);
                                    await setSeasonExtraMostDnf(val);
                                    setSaving(false);
                                    refreshUser();
                                    router.refresh();
                                },
                            },
                            {
                                icon: <Flame className="h-4 w-4 text-amber-400" />,
                                label: "Kolizja na starcie?",
                                sublabel: "W 1. wyścigu",
                                placeholder: "Tak / Nie",
                                value: firstRaceCollision === null ? "" : String(firstRaceCollision),
                                options: yesNoOptions,
                                color: "amber",
                                onChange: async (val: string) => {
                                    const b = val === "true";
                                    setFirstRaceCollision(b);
                                    setSaving(true);
                                    await setSeasonExtraFirstRaceCollision(b);
                                    setSaving(false);
                                    refreshUser();
                                    router.refresh();
                                },
                            },
                            {
                                icon: <CloudRain className="h-4 w-4 text-blue-400" />,
                                label: "Deszcz na wyścigu?",
                                sublabel: "W 1. wyścigu",
                                placeholder: "Tak / Nie",
                                value: firstRaceRain === null ? "" : String(firstRaceRain),
                                options: yesNoOptions,
                                color: "blue",
                                onChange: async (val: string) => {
                                    const b = val === "true";
                                    setFirstRaceRain(b);
                                    setSaving(true);
                                    await setSeasonExtraFirstRaceRain(b);
                                    setSaving(false);
                                    refreshUser();
                                    router.refresh();
                                },
                            },
                        ].map((item, index) => {
                            const hasValue = item.value !== "";

                            return (
                                <div
                                    key={item.label}
                                    style={{ zIndex: 100 - index }}
                                    className={clsx(
                                        "group relative rounded-2xl border transition-all duration-200",
                                        hasValue
                                            ? "bg-[#1C1C1E] border-white/[0.04]"
                                            : "bg-white/[0.02] border-transparent"
                                    )}
                                >
                                    {hasValue && (
                                        <div className="absolute left-0 right-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    )}

                                    <div className="p-3.5 sm:p-4">
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05]">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black leading-tight text-white">
                                                        {item.label}
                                                    </div>
                                                    <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                                                        {item.sublabel}
                                                    </div>
                                                </div>
                                            </div>
                                            {hasValue && (
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15">
                                                    <Check className="h-3 w-3 text-green-400" />
                                                </div>
                                            )}
                                        </div>

                                        <CustomSelect
                                            label=""
                                            placeholder={item.placeholder}
                                            value={item.value}
                                            options={item.options}
                                            disabled={locked || saving}
                                            onChange={item.onChange}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {locked && (
                        <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] px-4 py-3 border border-white/5">
                            <Lock className="h-4 w-4 shrink-0 text-gray-500" />
                            <span className="text-xs font-bold text-gray-500">
                                Typowanie zostało zamknięte — nie możesz już zmieniać odpowiedzi.
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
