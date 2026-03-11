"use client";

import { Driver, getTeamLogo, normalizeCountryCode } from "@/lib/data";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { GripVertical, ArrowUpDown, CheckCircle2, CircleDashed, ArrowDownToLine } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import ReactCountryFlag from "react-country-flag";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { getSeasonVotes } from "@/app/actions/seasonVote";
import { getLiveRaceVotes, getLiveSprintVotes } from "@/app/actions/races";
import { saveRaceVotes, getRaceVoterStatus, getMyRaceVotes, saveSprintVotes, getMySprintVotes, getSprintVoterStatus } from "@/app/actions/votes";
import RaceResultsContent from "./results/RaceResultsContent";

type Props = {
  race: { round: number; name: string; date: string; hasSprint?: boolean; sprintDate?: string; sprintCompleted?: boolean; completed?: boolean };
  drivers: Driver[];
};

type LiveVote = {
  driverId: string;
  position: number;
  userId: string;
  userName: string | null;
  userAvatar: string | null;
};

type VoterStatus = {
  id: string;
  name: string | null;
  avatar: string;
  team?: string | null;
  hasVoted: boolean;
};

export function VoteComponent({ race, drivers }: Props) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // ── Sprint/Race tab ──
  const hasSprint = race.hasSprint && race.sprintDate;
  const searchParams = useSearchParams();
  const initTab = searchParams.get("tab") as "sprint" | "race" | null;
  const [activeTab, setActiveTab] = useState<"sprint" | "race">(initTab && hasSprint ? initTab : (hasSprint ? "sprint" : "race"));
  const isSprint = activeTab === "sprint";
  
  // ── Race state ──
  const [raceTimeLeft, setRaceTimeLeft] = useState("");
  const [raceOrderedDrivers, setRaceOrderedDrivers] = useState<Driver[]>(drivers);
  const [raceIsLocked, setRaceIsLocked] = useState(false);
  const [raceLiveVotes, setRaceLiveVotes] = useState<LiveVote[]>([]);
  const [raceVoterStatus, setRaceVoterStatus] = useState<VoterStatus[]>([]);
  
  // ── Sprint state ──
  const [sprintTimeLeft, setSprintTimeLeft] = useState("");
  const [sprintOrderedDrivers, setSprintOrderedDrivers] = useState<Driver[]>(drivers);
  const [sprintIsLocked, setSprintIsLocked] = useState(false);
  const [sprintLiveVotes, setSprintLiveVotes] = useState<LiveVote[]>([]);
  const [sprintVoterStatus, setSprintVoterStatus] = useState<VoterStatus[]>([]);
  
  // ── Active state (derived from tab) ──
  const timeLeft = isSprint ? sprintTimeLeft : raceTimeLeft;
  const orderedDrivers = isSprint ? sprintOrderedDrivers : raceOrderedDrivers;
  const setOrderedDrivers = isSprint ? setSprintOrderedDrivers : setRaceOrderedDrivers;
  const isLocked = isSprint ? sprintIsLocked : raceIsLocked;
  const liveVotes = isSprint ? sprintLiveVotes : raceLiveVotes;
  const voterStatus = isSprint ? sprintVoterStatus : raceVoterStatus;
  
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Screen-width based mobile detection (< 768px)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Update tab state & URL
  const handleTabChange = (tab: "sprint" | "race") => {
    if (activeTab === tab) return;
    setActiveTab(tab);
    setSelectedId(null);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(null, '', url.toString());
  };

  // Sync tab with URL if it changes externally
  useEffect(() => {
    const tabUrl = searchParams.get("tab");
    if ((tabUrl === "sprint" || tabUrl === "race") && activeTab !== tabUrl) {
      setActiveTab(tabUrl);
      setSelectedId(null);
    }
  }, [searchParams, activeTab]);

  // Desktop sensors
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Main init: load stored votes, then set driver order
  useEffect(() => {
    if (!authLoading && user?.isAdmin) {
      router.push("/admin");
      return;
    }

    async function init() {
      // ── Race init ──
      const raceDate = new Date(race.date);
      const raceCurrentlyLocked = raceDate.getTime() - Date.now() <= 0;
      setRaceIsLocked(raceCurrentlyLocked);

      try {
        const serverRaceVotes = await getMyRaceVotes(race.round);
        if (serverRaceVotes.length > 0) {
          const restored = [
            ...serverRaceVotes
              .map((slug) => drivers.find((d) => d.id === slug))
              .filter((d): d is Driver => Boolean(d)),
            ...drivers.filter((d) => !serverRaceVotes.includes(d.id)),
          ];
          setRaceOrderedDrivers(restored);
        } else {
          try {
            const seasonVotes = await getSeasonVotes();
            if (seasonVotes.length > 0) {
              const seasonSlugs = seasonVotes.map((sv) => sv.driverSlug);
              const bySeasonOrder = [
                ...seasonSlugs
                  .map((slug) => drivers.find((d) => d.id === slug))
                  .filter((d): d is Driver => Boolean(d)),
                ...drivers.filter((d) => !seasonSlugs.includes(d.id)),
              ];
              setRaceOrderedDrivers(bySeasonOrder);
              await saveRaceVotes(race.round, bySeasonOrder.map((d) => d.id));
            }
          } catch {
            // Fall back silently
          }
        }
      } catch {
        // Network error
      }

      try {
        const statuses = await getRaceVoterStatus(race.round);
        setRaceVoterStatus(statuses);
      } catch { /* ignore */ }

      if (raceCurrentlyLocked) {
        try {
          const res = await getLiveRaceVotes(race.round);
          if (res.votes) setRaceLiveVotes(res.votes);
        } catch { /* ignore */ }
      }

      // ── Sprint init (if applicable) ──
      if (hasSprint && race.sprintDate) {
        const sprintDate = new Date(race.sprintDate);
        const sprintCurrentlyLocked = sprintDate.getTime() - Date.now() <= 0;
        setSprintIsLocked(sprintCurrentlyLocked);

        try {
          const serverSprintVotes = await getMySprintVotes(race.round);
          if (serverSprintVotes.length > 0) {
            const restored = [
              ...serverSprintVotes
                .map((slug) => drivers.find((d) => d.id === slug))
                .filter((d): d is Driver => Boolean(d)),
              ...drivers.filter((d) => !serverSprintVotes.includes(d.id)),
            ];
            setSprintOrderedDrivers(restored);
          } else {
            // Use race votes or season votes as sprint defaults
            try {
              const raceVotes = await getMyRaceVotes(race.round);
              if (raceVotes.length > 0) {
                const restored = [
                  ...raceVotes
                    .map((slug) => drivers.find((d) => d.id === slug))
                    .filter((d): d is Driver => Boolean(d)),
                  ...drivers.filter((d) => !raceVotes.includes(d.id)),
                ];
                setSprintOrderedDrivers(restored);
                await saveSprintVotes(race.round, restored.map((d) => d.id));
              } else {
                const seasonVotes = await getSeasonVotes();
                if (seasonVotes.length > 0) {
                  const seasonSlugs = seasonVotes.map((sv) => sv.driverSlug);
                  const bySeasonOrder = [
                    ...seasonSlugs
                      .map((slug) => drivers.find((d) => d.id === slug))
                      .filter((d): d is Driver => Boolean(d)),
                    ...drivers.filter((d) => !seasonSlugs.includes(d.id)),
                  ];
                  setSprintOrderedDrivers(bySeasonOrder);
                  await saveSprintVotes(race.round, bySeasonOrder.map((d) => d.id));
                }
              }
            } catch {
              // Fall back silently
            }
          }
        } catch {
          // Network error
        }

        try {
          const statuses = await getSprintVoterStatus(race.round);
          setSprintVoterStatus(statuses);
        } catch { /* ignore */ }

        if (sprintCurrentlyLocked) {
          try {
            const res = await getLiveSprintVotes(race.round);
            if (res.votes) setSprintLiveVotes(res.votes);
          } catch { /* ignore */ }
        }
      }

      setLoading(false);
    }

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  // Countdown timer for RACE
  useEffect(() => {
    const raceDate = new Date(race.date);
    const update = () => {
      const diff = raceDate.getTime() - Date.now();
      if (diff <= 0) {
          setRaceTimeLeft("WYŚCIG ROZPOCZĘTY");
          if (!raceIsLocked) {
             setRaceIsLocked(true);
             getLiveRaceVotes(race.round).then((res: any) => {
                 if (res.votes) setRaceLiveVotes(res.votes);
             }).catch(() => {});
          }
          return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setRaceTimeLeft(`${d}d ${h}h ${m}m`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [race.date, race.round, raceIsLocked]);

  // Countdown timer for SPRINT
  useEffect(() => {
    if (!hasSprint || !race.sprintDate) return;
    const sprintDate = new Date(race.sprintDate);
    const update = () => {
      const diff = sprintDate.getTime() - Date.now();
      if (diff <= 0) {
          setSprintTimeLeft("SPRINT ROZPOCZĘTY");
          if (!sprintIsLocked) {
             setSprintIsLocked(true);
             getLiveSprintVotes(race.round).then((res: any) => {
                 if (res.votes) setSprintLiveVotes(res.votes);
             }).catch(() => {});
          }
          return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setSprintTimeLeft(`${d}d ${h}h ${m}m`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [race.sprintDate, race.round, sprintIsLocked, hasSprint]);

  // ── Desktop drag handlers ──────────────────────────────────────────────────
  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const saveFn = isSprint ? saveSprintVotes : saveRaceVotes;

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    if (isLocked || !user) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = orderedDrivers.findIndex((d) => d.id === active.id);
      const newIdx = orderedDrivers.findIndex((d) => d.id === over.id);
      const next = arrayMove(orderedDrivers, oldIdx, newIdx);
      setOrderedDrivers(next);
      // Persist to server DB (source of truth)
      saveFn(race.round, next.map((d) => d.id)).catch(() => {});
      toast.success("Typy zapisano!");
    }
  };

  // ── Mobile tap-to-swap ─────────────────────────────────────────────────────
  const handleTapBadge = async (driverId: string) => {
    if (isLocked || !user) return;
    if (!selectedId) { setSelectedId(driverId); return; }
    if (selectedId === driverId) { setSelectedId(null); return; }

    const idxA = orderedDrivers.findIndex((d) => d.id === selectedId);
    const idxB = orderedDrivers.findIndex((d) => d.id === driverId);
    if (idxA === -1 || idxB === -1) { setSelectedId(null); return; }

    const next = [...orderedDrivers];
    [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
    setOrderedDrivers(next);
    setSelectedId(null);
    // Persist to server DB (source of truth)
    saveFn(race.round, next.map((d) => d.id)).catch(() => {});
    toast.success("Pozycje zamienione!");
  };

  // ── Mobile insert-between ────────────────────────────────────────────────
  const handleInsertAt = async (insertIndex: number) => {
    if (isLocked || !user || !selectedId) return;

    const fromIdx = orderedDrivers.findIndex((d) => d.id === selectedId);
    if (fromIdx === -1) { setSelectedId(null); return; }

    // Remove the driver from its current position
    const next = [...orderedDrivers];
    const [moved] = next.splice(fromIdx, 1);

    // Adjust the target index after removal
    const adjustedIdx = insertIndex > fromIdx ? insertIndex - 1 : insertIndex;

    // Insert at the target position
    next.splice(adjustedIdx, 0, moved);

    setOrderedDrivers(next);
    setSelectedId(null);
    saveRaceVotes(race.round, next.map((d) => d.id)).catch(() => {});
    toast.success("Kierowca przeniesiony!");
  };

  const activeDriver = activeId ? orderedDrivers.find((d) => d.id === activeId) : null;

  // Helper for mobile insert-between: skip slots that would be no-ops
  const selectedIdx = selectedId
    ? orderedDrivers.findIndex((d) => d.id === selectedId)
    : -1;
  const isInsertNoOp = (pos: number) =>
    selectedIdx !== -1 && (pos === selectedIdx || pos === selectedIdx + 1);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-pulse text-[#E60000] font-black text-xl">ŁADOWANIE STAWKI...</div>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-6 px-4">
      {/* Dynamic Sprint Background Glow */}
      <div 
        className={clsx(
          "fixed inset-0 z-[-1] pointer-events-none transition-opacity duration-1000 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-[#0D0D0D]/0 to-transparent",
          isSprint ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase leading-tight mb-2">
          {race.name}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs font-bold">
            Runda {race.round}
          </Badge>
          {isSprint && (
            <Badge className="text-xs font-bold bg-amber-500/20 text-amber-400 border-amber-500/30" variant="outline">
              ⚡ SPRINT
            </Badge>
          )}
          <Badge
            className={clsx(
              "text-xs font-bold",
              isLocked
                ? "bg-[#E60000] text-white border-[#E60000]"
                : "bg-[#E60000]/10 text-[#E60000] border-[#E60000]/20"
            )}
            variant="outline"
          >
            ⏱ {timeLeft || "..."}
          </Badge>
        </div>

        {/* Sprint / Race Tabs - Fixed above global nav on mobile, static center on desktop */}
        {hasSprint && (
          <div className="fixed bottom-32 left-4 right-4 z-50 md:static md:bottom-auto md:left-auto md:right-auto md:mb-6 pointer-events-none flex justify-center">
            <div className="w-full max-w-sm p-1.5 bg-[#1C1C1E]/80 backdrop-blur-2xl rounded-2xl flex relative shadow-[0_20px_40px_rgba(0,0,0,0.9)] border border-white/10 pointer-events-auto">
              <button
                onClick={() => handleTabChange("sprint")}
                className={clsx(
                  "flex-1 py-3.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                  activeTab === "sprint"
                    ? "bg-[#2C2C2E] text-amber-500 shadow-md border border-white/10 scale-[1.02]"
                    : "text-gray-500 hover:text-gray-300 active:scale-95"
                )}
              >
                ⚡ Sprint
              </button>
              <button
                onClick={() => handleTabChange("race")}
                className={clsx(
                  "flex-1 py-3.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                  activeTab === "race"
                    ? "bg-[#2C2C2E] text-[#E60000] shadow-md border border-white/10 scale-[1.02]"
                    : "text-gray-500 hover:text-gray-300 active:scale-95"
                )}
              >
                🏁 Wyścig
              </button>
            </div>
          </div>
        )}

        {!isLocked && user && (
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
            {isMobile
              ? selectedId
                ? "👆 Dotknij ⬇ aby wstawić, lub numer aby zamienić"
                : "👆 Dotknij numer pozycji, aby wybrać kierowcę"
              : "Przeciągnij ⠿, aby zmienić kolejność"}
          </p>
        )}
        {!isLocked && !user && (
          <p className="text-[#E60000] text-xs uppercase tracking-widest font-bold mt-2">
            Zaloguj się, aby wytypować wyniki tej rundy
          </p>
        )}
        {isLocked && (
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
            {isSprint ? "Stawka zablokowana — sprint się rozpoczął" : "Stawka zablokowana — wyścig się rozpoczął"}
          </p>
        )}
      </div>

      {/* ── Voter Status ── */}
      {voterStatus.length > 0 && !isLocked && (
        <div className="mb-6 bg-[#1C1C1E] rounded-2xl p-4 border border-white/5 overflow-x-auto custom-scrollbar">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 flex items-center justify-between">
              <span>Kto oddał typy?</span>
              <span className="text-[#E60000]">{voterStatus.filter(v => v.hasVoted).length} / {voterStatus.length}</span>
            </div>
            <div className="flex gap-3 pb-2 w-max items-start">
              {voterStatus.map(v => (
                  <div key={v.id} className="flex flex-col items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                      <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={v.avatar} 
                            alt={v.name || "User"} 
                            className={clsx(
                              "w-10 h-10 rounded-full object-cover border-2 shadow-sm",
                              v.hasVoted ? 'border-green-500 shadow-green-900/20' : 'border-gray-700 grayscale opacity-40'
                            )} 
                          />
                          {v.hasVoted ? (
                              <div className="absolute -bottom-1 -right-1 bg-[#1C1C1E] rounded-full">
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                              </div>
                          ) : (
                              <div className="absolute -bottom-1 -right-1 bg-[#1C1C1E] rounded-full">
                                  <CircleDashed className="w-4 h-4 text-gray-600" />
                              </div>
                          )}
                      </div>
                      <div className="text-[9px] font-bold text-gray-400 max-w-[50px] truncate text-center leading-tight">
                        {v.name}
                      </div>
                  </div>
              ))}
            </div>
        </div>
      )}

      {/* ── Mobile ── */}
      {isMobile ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={`container-${activeTab}`} // Forces re-mount and animation when tab changes
            initial={{ opacity: 0, x: isSprint ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSprint ? -10 : 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="grid grid-cols-1 gap-0 mb-6"
          >
            {(isSprint && race.sprintCompleted) || (!isSprint && race.completed) ? (
              <RaceResultsContent raceRound={race.round} isSprint={isSprint} hideHeader={true} />
            ) : (
              orderedDrivers.map((driver, index) => {
                const isDriverSelected = selectedId === driver.id;
                const showInsertSlots = selectedId !== null && !isDriverSelected;
                return (
                  <motion.div 
                    key={`${activeTab}-${driver.id}`} 
                    layout="position"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  >
                    {/* Insert slot BEFORE this driver (only for the first driver) */}
                    {index === 0 && showInsertSlots && !isInsertNoOp(0) && (
                      <InsertSlot
                        position={0}
                        onClick={() => handleInsertAt(0)}
                      />
                    )}
                    <div className="py-1">
                      <DriverCard
                        driver={driver}
                        index={index}
                        disabled={isLocked || !user}
                        isSelected={isDriverSelected}
                        isSwapTarget={selectedId !== null && selectedId !== driver.id}
                        onTapBadge={() => handleTapBadge(driver.id)}
                        mobile
                        otherVotes={liveVotes.filter(v => v.driverId === driver.id && v.userId !== user?.id)}
                      />
                    </div>
                    {/* Insert slot AFTER this driver */}
                    {showInsertSlots && !isInsertNoOp(index + 1) && (
                      <InsertSlot
                        position={index + 1}
                        onClick={() => handleInsertAt(index + 1)}
                      />
                    )}
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        /* ── Desktop ── */
        <AnimatePresence mode="wait">
          <motion.div
            key={`container-${activeTab}`} // Forces re-mount and animation when tab changes
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.15 }}
          >
            {(isSprint && race.sprintCompleted) || (!isSprint && race.completed) ? (
              <RaceResultsContent raceRound={race.round} isSprint={isSprint} hideHeader={true} />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={orderedDrivers.map((d) => d.id)} strategy={verticalListSortingStrategy}>
                  <div className="grid grid-cols-1 gap-2 mb-6">
                    {orderedDrivers.map((driver, index) => (
                      <SortableDriverCard
                        key={driver.id}
                        driver={driver}
                        index={index}
                        disabled={isLocked || !user}
                        isBeingDragged={driver.id === activeId}
                        otherVotes={liveVotes.filter(v => v.driverId === driver.id && v.userId !== user?.id)}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay adjustScale={false}>
                  {activeDriver ? (
                    <DriverCard
                      driver={activeDriver}
                      index={orderedDrivers.findIndex((d) => d.id === activeId)}
                      overlay
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ─── Desktop sortable wrapper ──────────────────────────────────────────────
function SortableDriverCard({
  driver,
  index,
  disabled,
  isBeingDragged,
  otherVotes = [],
}: {
  driver: Driver;
  index: number;
  disabled: boolean;
  isBeingDragged: boolean;
  otherVotes?: LiveVote[];
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: driver.id,
    disabled,
  });

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
        disabled={disabled} // Keep disabled prop
        isDragging={isBeingDragged} // Renamed ghost to isDragging
        dragHandleProps={{ ...attributes, ...listeners }}
        otherVotes={otherVotes}
      />
    </div>
  );
}

// ─── Shared card ──────────────────────────────────────────────────────────
function DriverCard({
  driver,
  index,
  disabled,
  dragHandleProps,
  isDragging, // Renamed ghost to isDragging
  overlay,
  mobile,
  isSelected,
  isSwapTarget,
  onTapBadge,
  otherVotes = [],
}: {
  driver: Driver;
  index: number;
  disabled?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean; // Renamed ghost to isDragging
  overlay?: boolean;
  mobile?: boolean;
  isSelected?: boolean;
  isSwapTarget?: boolean;
  onTapBadge?: () => void;
  otherVotes?: LiveVote[];
}) {
  const isPodium = index < 3;

  return (
    <Card
      className={clsx(
        "border-border bg-card overflow-hidden transition-all duration-150 select-none",
        isDragging && "opacity-30 scale-[0.98]",
        overlay && "shadow-2xl shadow-black/60 ring-2 ring-[#E60000] scale-[1.02] rotate-1",
        isSelected && "ring-2 ring-[#E60000] scale-[1.01]",
        isSwapTarget && !disabled && "ring-1 ring-white/20"
      )}
    >
      <CardContent className="flex items-center gap-3 p-3">
        {/* Position badge — tappable on mobile */}
        {mobile ? (
          <button
            onClick={onTapBadge}
            disabled={disabled}
            aria-label={`Pozycja ${index + 1}`}
            className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
              "font-black text-lg transition-all duration-200 active:scale-90 focus:outline-none",
              disabled
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
            {isSelected ? <ArrowUpDown className="w-4 h-4" /> : index + 1}
          </button>
        ) : (
          <div
            className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-lg",
              isPodium ? "bg-[#E60000]/20 text-[#E60000]" : "bg-secondary text-muted-foreground"
            )}
          >
            {index + 1}
          </div>
        )}

        {/* Main Content Wrapper */}
        <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-center">
          <div className="flex items-start">
            {/* Driver number */}
            <div className="w-8 flex-shrink-0 mt-0.5">
              <span className="text-sm font-bold text-muted-foreground leading-tight">
                #{driver.number}
              </span>
            </div>

            {/* Driver info */}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-foreground flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <ReactCountryFlag
                    countryCode={normalizeCountryCode(driver.country)}
                    svg
                    style={{ width: "1.1em", height: "1.1em", borderRadius: "50%", objectFit: "cover" }}
                    aria-label={driver.country}
                  />
                </div>
                <span className="whitespace-normal break-words leading-tight">{driver.name}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getTeamLogo(driver.team)} alt={driver.team} className="w-3.5 h-3.5 object-contain" />
                <span className="text-[10px] text-muted-foreground uppercase truncate font-medium">
                  {driver.team}
                </span>
              </div>
            </div>
          </div>

          {/* Other users' votes */}
          {otherVotes.length > 0 && (
            <div className="flex -space-x-2.5 mt-3.5 pointer-events-none">
              {otherVotes.slice(0, 8).map((vote, i) => (
              <div 
                key={vote.userId} 
                className="relative w-10 h-10 shrink-0 rounded-full border-2 border-[#1C1C1E] bg-[#2C2C2E] flex items-center justify-center overflow-hidden shadow-sm"
                title={`${vote.userName}: ${vote.position}`}
                style={{ zIndex: 10 - i }}
              >
                {vote.userAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={vote.userAvatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-gray-400">
                    {vote.userName?.slice(0, 2).toUpperCase()}
                  </span>
                )}
                {/* Overlay their position choice */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="text-sm font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)]" style={{ textShadow: '0 0 4px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,0.8)' }}>
                    {vote.position}
                  </span>
                </div>
              </div>
            ))}
            {otherVotes.length > 8 && (
              <div 
                className="relative w-10 h-10 shrink-0 rounded-full border-2 border-[#1C1C1E] bg-[#2C2C2E] flex items-center justify-center shadow-sm"
                style={{ zIndex: 1 }}
              >
                <span className="text-xs font-bold text-gray-400">+{otherVotes.length - 8}</span>
              </div>
            )}
            </div>
          )}
        </div>

        {/* Desktop drag handle */}
        {!mobile && !disabled && (
          <div
            {...dragHandleProps}
            className="ml-1 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
            aria-label="Przeciągnij, aby zmienić kolejność"
          >
            <GripVertical className="w-5 h-5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Mobile insert slot ───────────────────────────────────────────────────
function InsertSlot({
  position,
  onClick,
}: {
  position: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full group flex items-center gap-2 py-1.5 px-3 my-0.5 rounded-xl
        border-2 border-dashed border-[#E60000]/30 bg-[#E60000]/5
        hover:border-[#E60000]/60 hover:bg-[#E60000]/10
        active:scale-[0.98] active:bg-[#E60000]/20
        transition-all duration-200 focus:outline-none"
      aria-label={`Wstaw na pozycję ${position + 1}`}
    >
      <div className="w-8 h-8 rounded-lg bg-[#E60000]/20 flex items-center justify-center flex-shrink-0">
        <ArrowDownToLine className="w-4 h-4 text-[#E60000] group-hover:scale-110 transition-transform" />
      </div>
      <span className="text-[11px] font-bold text-[#E60000]/70 uppercase tracking-wider group-hover:text-[#E60000]">
        Wstaw tutaj
      </span>
      <span className="ml-auto text-[10px] font-medium text-[#E60000]/40">
        → P{position + 1}
      </span>
    </button>
  );
}
