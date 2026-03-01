"use client";

import { useStore } from "@/lib/store";
import { Driver, getTeamLogo, normalizeCountryCode } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { GripVertical, ArrowUpDown, CheckCircle2, CircleDashed } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import ReactCountryFlag from "react-country-flag";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { getLiveRaceVotes } from "@/app/actions/races";
import { saveRaceVotes, getRaceVoterStatus } from "@/app/actions/votes";

type Props = {
  race: { round: number; name: string; date: string };
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
  const { votes, userId, setSessionVotes, loadFromIndexedDB } = useStore();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");
  const [orderedDrivers, setOrderedDrivers] = useState<Driver[]>(drivers);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [liveVotes, setLiveVotes] = useState<LiveVote[]>([]);
  const [voterStatus, setVoterStatus] = useState<VoterStatus[]>([]);

  // Screen-width based mobile detection (< 768px)
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

  // Main init: load stored votes, then set driver order
  useEffect(() => {
    if (!authLoading && user?.isAdmin) {
      router.push("/admin");
      return;
    }

    async function init() {
      await loadFromIndexedDB();

      setIsLocked(Date.now() > new Date(race.date).getTime());

      // Read the just-loaded store state via zustand's getState
      const { votes: storedVotes, userId: storedUserId } = useStore.getState();
      const prefix = `race-${race.round}-position-`;
      const raceVotes = storedVotes.filter(
        (v) => v.userId === storedUserId && String(v.raceRound).startsWith(prefix)
      );

      if (raceVotes.length > 0) {
        // ── Restore previously saved race order ──
        const restored = [...drivers].sort((a, b) => {
          const vA = raceVotes.find((v) => v.driverId === a.id);
          const vB = raceVotes.find((v) => v.driverId === b.id);
          const pA = vA ? parseInt(String(vA.raceRound).split("-")[3]) : 999;
          const pB = vB ? parseInt(String(vB.raceRound).split("-")[3]) : 999;
          return pA - pB;
        });
        setOrderedDrivers(restored);
        // Sync to server DB in background (in case only stored in IndexedDB)
        saveRaceVotes(race.round, restored.map((d) => d.id)).catch(() => {});
      } else {
        // ── No race votes yet — pre-populate from season picks ──
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
            setOrderedDrivers(bySeasonOrder);
          }
          // else keep default prop order
        } catch {
          // Fall back silently to default driver order
        }
      }

      const raceDate = new Date(race.date);
      const isCurrentlyLocked = raceDate.getTime() - Date.now() <= 0;
      setIsLocked(isCurrentlyLocked);

      try {
        const statuses = await getRaceVoterStatus(race.round);
        setVoterStatus(statuses);
      } catch {
        // Ignore
      }

      if (isCurrentlyLocked) {
        try {
          const res = await getLiveRaceVotes(race.round);
          if (res.votes) {
            setLiveVotes(res.votes);
          }
        } catch {
          // Ignore
        }
      }

      setLoading(false);
    }

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  // Countdown timer
  useEffect(() => {
    const raceDate = new Date(race.date);
    const update = () => {
      const diff = raceDate.getTime() - Date.now();
      if (diff <= 0) {
          setTimeLeft("WYŚCIG ROZPOCZĘTY");
          if (!isLocked) {
             setIsLocked(true);
             // Fetch live votes the moment it locks, if we are currently looking at the page
             getLiveRaceVotes(race.round).then(res => {
                 if (res.votes) setLiveVotes(res.votes);
             }).catch(() => {});
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
  }, [race.date, race.round, isLocked]);

  // ── Desktop drag handlers ──────────────────────────────────────────────────
  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    if (isLocked) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = orderedDrivers.findIndex((d) => d.id === active.id);
      const newIdx = orderedDrivers.findIndex((d) => d.id === over.id);
      const next = arrayMove(orderedDrivers, oldIdx, newIdx);
      setOrderedDrivers(next);
      await setSessionVotes(`race-${race.round}-position-`, userId || "", next.map((d) => d.id));
      // Also persist to server DB for scoring
      saveRaceVotes(race.round, next.map((d) => d.id)).catch(() => {});
      toast.success("Typy zapisano!");
    }
  };

  // ── Mobile tap-to-swap ─────────────────────────────────────────────────────
  const handleTapBadge = async (driverId: string) => {
    if (isLocked) return;
    if (!selectedId) { setSelectedId(driverId); return; }
    if (selectedId === driverId) { setSelectedId(null); return; }

    const idxA = orderedDrivers.findIndex((d) => d.id === selectedId);
    const idxB = orderedDrivers.findIndex((d) => d.id === driverId);
    if (idxA === -1 || idxB === -1) { setSelectedId(null); return; }

    const next = [...orderedDrivers];
    [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
    setOrderedDrivers(next);
    setSelectedId(null);
    await setSessionVotes(`race-${race.round}-position-`, userId || "", next.map((d) => d.id));
    // Also persist to server DB for scoring
    saveRaceVotes(race.round, next.map((d) => d.id)).catch(() => {});
    toast.success("Pozycje zamienione!");
  };

  const activeDriver = activeId ? orderedDrivers.find((d) => d.id === activeId) : null;

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-pulse text-[#E60000] font-black text-xl">ŁADOWANIE STAWKI...</div>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-6 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase leading-tight mb-2">
          {race.name}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs font-bold">
            Runda {race.round}
          </Badge>
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

        {!isLocked && (
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
            {isMobile
              ? selectedId
                ? "👆 Dotknij numer pozycji, aby zamienić miejsca"
                : "👆 Dotknij numer pozycji, aby wybrać kierowcę"
              : "Przeciągnij ⠿, aby zmienić kolejność"}
          </p>
        )}
        {isLocked && (
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
            Stawka zablokowana — wyścig się rozpoczął
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
        <div className="grid grid-cols-1 gap-2 mb-6">
          {orderedDrivers.map((driver, index) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              index={index}
              disabled={isLocked}
              isSelected={selectedId === driver.id}
              isSwapTarget={selectedId !== null && selectedId !== driver.id}
              onTapBadge={() => handleTapBadge(driver.id)}
              mobile
              otherVotes={liveVotes.filter(v => v.driverId === driver.id && v.userId !== user?.id)}
            />
          ))}
        </div>
      ) : (
        /* ── Desktop ── */
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
                  disabled={isLocked}
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
