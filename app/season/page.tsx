"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { GripVertical, Plus, X, Lock, Trophy, Star, ArrowUpDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
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
import { getTeamLogo, normalizeCountryCode } from "@/lib/data";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getSeasonVotes,
  getAvailableDrivers,
  addSeasonVote,
  removeSeasonVote,
  reorderSeasonVotes,
  isSeasonLocked,
} from "@/app/actions/seasonVote";

type DriverInfo = {
  slug: string;
  name: string;
  number: number;
  country: string | null;
  color: string | null;
  team: string;
};

type PickedDriver = DriverInfo & { position: number };

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
        "border-border bg-card overflow-hidden transition-all duration-150 select-none",
        isDragging && "opacity-40 scale-[0.98]",
        isChampion && "ring-1 ring-yellow-500/20",
        isSelected && "ring-2 ring-[#E60000] scale-[1.01]",
        isSwapTarget && !locked && "ring-1 ring-white/20"
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

// ─── Main page ─────────────────────────────────────────────────────────────
export default function SeasonVotePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [pickedDrivers, setPickedDrivers] = useState<PickedDriver[]>([]);
  const [allDrivers, setAllDrivers] = useState<DriverInfo[]>([]);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Screen-width based mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Desktop sensors
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        const [lockStatus, votes, driversData] = await Promise.all([
          isSeasonLocked(),
          getSeasonVotes(),
          getAvailableDrivers(),
        ]);
        setLocked(lockStatus);
        setAllDrivers(driversData);
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
        setLoading(false);
      }
    }
    if (!authLoading && user) loadData();
  }, [authLoading, user]);

  // Countdown
  useEffect(() => {
    const firstRaceDate = new Date("2026-03-08T05:00:00Z");
    const update = () => {
      const diff = firstRaceDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("ZABLOKOWANE"); setLocked(true); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  // Redirect
  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/login");
      else if (user.isAdmin) router.push("/admin");
    }
  }, [authLoading, user, router]);

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

  // ─── Add ────────────────────────────────────────────────────────
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

  // ─── Remove ─────────────────────────────────────────────────────
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

  if (loading || authLoading) {
    return (
      <div className="animate-pulse space-y-2 pb-24 pt-8 px-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-16 bg-card rounded-2xl w-full border border-border" />
        ))}
      </div>
    );
  }

  const progress = allDrivers.length > 0 ? (pickedDrivers.length / allDrivers.length) * 100 : 0;

  const hintText = isMobile
    ? selectedSlug
      ? "👆 Dotknij numer pozycji, aby zamienić miejsca"
      : "👆 Dotknij numer pozycji, aby wybrać kierowcę"
    : "Przeciągnij ⠿, aby zmienić kolejność";

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Main content area - grows to fit drivers */}
      <div className="flex-1 px-4 pt-8 pb-8">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm -mx-4 px-4 pb-4 pt-2">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter leading-none">
                MISTRZOSTWA <span className="text-[#E60000]">2026</span>
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">
                {locked ? "Stawka zablokowana" : hintText}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                className={clsx(
                  "text-xs font-bold",
                  locked
                    ? "bg-[#E60000] text-white border-[#E60000]"
                    : "bg-[#E60000]/10 text-[#E60000] border-[#E60000]/20"
                )}
                variant="outline"
              >
                {locked ? <Lock className="w-3 h-3 mr-1" /> : "⏰ "}{timeLeft || "..."}
              </Badge>
              {!locked && saving && (
                <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full animate-pulse shadow-[0_0_8px_#E60000]" />
              )}
            </div>
          </div>

          {/* Progress bar */}
          {!locked && (
            <div className="h-1 bg-border rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-gradient-to-r from-[#E60000] to-red-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Picked driver list */}
        <div className="mt-4">
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
            <div className="py-20 flex flex-col items-center justify-center text-center px-8 border-2 border-dashed border-border rounded-3xl">
              <Trophy className="w-14 h-14 text-muted-foreground/30 mb-6" />
              <h2 className="text-xl font-bold text-foreground mb-2 uppercase">Kto zostanie mistrzem?</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Wybierz swojego faworyta z listy poniżej.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom drawer — available drivers */}
      {!locked && (
        availableDrivers.length > 0 ? (
          <div className="bg-card border border-border p-4 rounded-3xl mx-4 mb-24 shadow-2xl z-30">
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
          <div className="bg-card border border-border rounded-3xl p-6 text-center mx-4 mb-24">
            <div className="text-[#E60000] font-black text-xs uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4" /> Stawka kompletna
            </div>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
              {isMobile ? "Dotknij numery pozycji, aby zmieniać kolejność." : "Przeciągnij ⠿, aby zmieniać kolejność."}
            </p>
          </div>
        )
      )}
    </div>
  );
}
