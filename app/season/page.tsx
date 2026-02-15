"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { clsx } from "clsx";
import { GripVertical, Plus, X, Lock, Trophy, Star } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
import { getTeamLogo } from "@/lib/data";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthProvider";
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

// ─── Sortable Driver Item ───────────────────────────────────────
function SortableDriverItem({
  driver,
  index,
  locked,
  onRemove,
}: {
  driver: PickedDriver;
  index: number;
  locked: boolean;
  onRemove: (slug: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: driver.slug, disabled: locked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isChampion = index === 0;
  const isPodium = index < 3;
  const teamColor = driver.color?.split(" ")[0] || "bg-gray-600";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "flex items-center p-2.5 md:p-3 rounded-2xl transition-all touch-manipulation select-none border border-white/5",
        "bg-[#1C1C1E] group relative overflow-hidden",
        isDragging && "opacity-90 scale-[0.98] shadow-2xl z-50 ring-2 ring-[#E60000] border-[#E60000]/30",
        isChampion && "ring-1 ring-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-transparent"
      )}
    >
      {/* Glow Effect for Champion */}
      {isChampion && (
        <div className="absolute inset-0 bg-yellow-500/5 blur-xl pointer-events-none" />
      )}

      {/* Position */}
      <div
        className={clsx(
          "w-10 h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 font-black text-xl transition-colors",
          isPodium ? "bg-[#E60000] text-white shadow-lg shadow-red-900/20" : "bg-[#2C2C2E] text-gray-500"
        )}
      >
        {isChampion ? <Star className="w-5 h-5 fill-white" /> : index + 1}
      </div>

      {/* Driver Number */}
      <span className="text-lg font-bold w-10 text-gray-600 flex-shrink-0">
        #{driver.number}
      </span>

      {/* Driver Info */}
      <div className="text-left flex-1 min-w-0">
        <div className="font-bold text-base leading-tight truncate flex items-center gap-1 text-white">
          {driver.country && <span className="text-xs grayscale opacity-70">{driver.country}</span>}
          <span className={clsx(isChampion && "text-yellow-500")}>{driver.name}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <img
            src={getTeamLogo(driver.team)}
            alt={driver.team}
            className="w-3.5 h-3.5 object-contain brightness-0 invert opacity-40"
          />
          <div className="text-[10px] text-gray-500 uppercase truncate font-bold tracking-tight">
            {driver.team}
          </div>
        </div>
      </div>

      {/* Team Stripe */}
      <div className={clsx("w-1.5 h-8 rounded-full ml-2 flex-shrink-0 opacity-80", teamColor)} />

      {/* Remove / Drag */}
      {!locked && (
        <div className="flex items-center ml-2 gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(driver.slug);
            }}
            className="p-1.5 text-gray-600 hover:text-[#E60000] hover:bg-white/5 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all"
          >
            <GripVertical className="w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Season Vote Page ──────────────────────────────────────
export default function SeasonVotePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [pickedDrivers, setPickedDrivers] = useState<PickedDriver[]>([]);
  const [allDrivers, setAllDrivers] = useState<DriverInfo[]>([]);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
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

    if (!authLoading && user) {
      loadData();
    }
  }, [authLoading, user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Available drivers = all drivers minus picked ones
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

  // ─── Add driver ───
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
        // Animation success toast
        if (newPosition === 1) toast.success(`MISTRZ: ${driver.name}!`);
      }
    } catch {
      setPickedDrivers((prev) => prev.filter((d) => d.slug !== driver.slug));
      toast.error("Błąd podczas dodawania");
    } finally {
      setSaving(false);
      refreshUser();
    }
  };

  // ─── Remove driver ───
  const handleRemoveDriver = async (slug: string) => {
    if (locked || saving) return;
    setSaving(true);

    const backup = [...pickedDrivers];
    setPickedDrivers((prev) => {
      const filtered = prev.filter((d) => d.slug !== slug);
      return filtered.map((d, i) => ({ ...d, position: i + 1 }));
    });

    try {
      const result = await removeSeasonVote(slug);
      if (result.error) {
        setPickedDrivers(backup);
        toast.error(result.error);
      }
    } catch {
      setPickedDrivers(backup);
      toast.error("Błąd podczas usuwania");
    } finally {
      setSaving(false);
      refreshUser();
    }
  };

  // ─── Drag reorder ───
  const handleDragEnd = async (event: DragEndEvent) => {
    if (locked || saving) return;
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = pickedDrivers.findIndex((d) => d.slug === active.id);
      const newIndex = pickedDrivers.findIndex((d) => d.slug === over.id);
      const newOrder = arrayMove(pickedDrivers, oldIndex, newIndex).map((d, i) => ({
        ...d,
        position: i + 1,
      }));

      const backup = [...pickedDrivers];
      setPickedDrivers(newOrder);
      setSaving(true);

      try {
        const result = await reorderSeasonVotes(newOrder.map((d) => d.slug));
        if (result.error) {
          setPickedDrivers(backup);
          toast.error(result.error);
        }
      } catch {
        setPickedDrivers(backup);
        toast.error("Błąd podczas zmiany kolejności");
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading || authLoading) {
    return (
      <div className="animate-pulse space-y-4 pb-24 pt-8 px-4 h-screen">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-[#1C1C1E] rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  const progress = (pickedDrivers.length / allDrivers.length) * 100;

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-[#0D0D0D]">
      {/* Scrollable Area for Added Drivers */}
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4 space-y-6">
        {/* Header and Progress */}
        <div className="sticky top-0 z-20 bg-[#0D0D0D]/95 backdrop-blur-sm -mx-4 px-4 pb-4 pt-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                MISTRZOSTWA <span className="text-[#E60000]">2026</span>
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1 font-black">
                Twoje typowanie końcowe
              </p>
            </div>
            {locked && (
              <span className="bg-[#E60000]/10 text-[#E60000] text-[10px] font-bold px-2 py-1 rounded-lg border border-[#E60000]/20 flex items-center gap-1">
                <Lock className="w-3 h-3" /> LOCKED
              </span>
            )}
            {!locked && saving && (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full animate-pulse shadow-[0_0_8px_#E60000]" />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Saving</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {!locked && (
            <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-gradient-to-r from-[#E60000] to-red-400 transition-all duration-500 shadow-[0_0_10px_rgba(230,0,0,0.4)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* List Section */}
        <div>
          {pickedDrivers.length > 0 ? (
            <div className="space-y-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={pickedDrivers.map((d) => d.slug)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 gap-2">
                    {pickedDrivers.map((driver, index) => (
                      <SortableDriverItem
                        key={driver.slug}
                        driver={driver}
                        index={index}
                        locked={locked}
                        onRemove={handleRemoveDriver}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Empty Slots Indicator */}
              {!locked && pickedDrivers.length < allDrivers.length && (
                <div className="space-y-2 opacity-20">
                  {[...Array(Math.min(3, allDrivers.length - pickedDrivers.length))].map((_, i) => (
                    <div key={i} className="flex items-center p-3 rounded-2xl border border-dashed border-white/20 h-16">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-3 font-black text-xl text-gray-700">
                        {pickedDrivers.length + i + 1}
                      </div>
                      <div className="h-4 w-24 bg-white/10 rounded-full" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center px-8 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]">
              <Trophy className="w-16 h-16 text-white/10 mb-6" />
              <h2 className="text-xl font-bold text-white mb-2 italic uppercase">Kto zostanie mistrzem?</h2>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Wybierz swojego faworyta z listy poniżej, aby rozpocząć typowanie sezonu 2026.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Available Drivers List — Bottom "Drawer" */}
      {!locked && (
        availableDrivers.length > 0 ? (
          <div className="bg-[#1C1C1E] border-t border-white/10 p-4 pb-8 shadow-2xl z-30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
                DOSTĘPNI KIEROWCY ({availableDrivers.length})
              </h2>
              {availableDrivers.length > 8 && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E60000] w-32 md:w-64 transition-all"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto no-scrollbar scroll-smooth">
              {filteredAvailable.map((driver) => {
                const teamColor = driver.color?.split(" ")[0] || "bg-gray-600";
                return (
                  <button
                    key={driver.slug}
                    onClick={() => handleAddDriver(driver)}
                    disabled={saving}
                    className={clsx(
                      "flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] active:scale-95 transition-all text-left group",
                      saving && "opacity-50 pointer-events-none"
                    )}
                  >
                    <div className={clsx("w-1 h-6 rounded-full flex-shrink-0", teamColor)} />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-300 group-hover:text-white truncate">
                        {driver.name}
                      </div>
                      <div className="text-[9px] text-gray-600 uppercase font-black truncate">
                        {driver.team}
                      </div>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-gray-700 group-hover:text-[#E60000]" />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-green-900/10 border-t border-green-500/20 p-6 text-center animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="text-green-500 font-black text-xs uppercase tracking-[0.3em] mb-2 flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4" /> Podium gotowe
            </div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-loose">
              Ustawienie sezonowe kompletne.<br />Możesz zmieniać kolejność przeciągając.
            </p>
          </div>
        )
      )}
    </div>
  );
}
