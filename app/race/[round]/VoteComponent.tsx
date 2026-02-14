"use client";

import { useStore } from "@/lib/store";
import { Driver } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
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

type Props = {
  race: { round: number; name: string; date: string };
  drivers: Driver[];
};

export function VoteComponent({ race, drivers }: Props) {
  const { votes, userId, setSessionVotes, loadFromIndexedDB } = useStore();
  const [timeLeft, setTimeLeft] = useState("");
  const [orderedDrivers, setOrderedDrivers] = useState(drivers);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadFromIndexedDB().then(() => {
        setLoading(false);
        const raceDate = new Date(race.date);
        setIsLocked(Date.now() > raceDate.getTime());
    });
  }, [loadFromIndexedDB, race.date]);

  // Restore previous order from votes
  useEffect(() => {
    if (loading) return;
    
    const prefix = `race-${race.round}-position-`;
    const raceVotes = votes.filter(v => 
      v.userId === userId && String(v.raceRound).startsWith(prefix)
    );

    if (raceVotes.length > 0) {
      const restored = [...drivers].sort((a, b) => {
        const voteA = raceVotes.find(v => v.driverId === a.id);
        const voteB = raceVotes.find(v => v.driverId === b.id);
        const posA = voteA ? parseInt(String(voteA.raceRound).split("-")[3]) : 999;
        const posB = voteB ? parseInt(String(voteB.raceRound).split("-")[3]) : 999;
        return posA - posB;
      });
      setOrderedDrivers(restored);
    } else {
      setOrderedDrivers(drivers);
    }
  }, [loading, votes, userId, drivers, race.round]);

  useEffect(() => {
    const raceDate = new Date(race.date);
    const updateCountdown = () => {
        const now = new Date();
        const diff = raceDate.getTime() - now.getTime();
        
        if (diff <= 0) {
            setTimeLeft("RACE STARTED");
            setIsLocked(true);
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [race.date]);

  const handleDragEnd = async (event: DragEndEvent) => {
    if (isLocked) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = orderedDrivers.findIndex((item) => item.id === active.id);
      const newIndex = orderedDrivers.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(orderedDrivers, oldIndex, newIndex);
      
      setOrderedDrivers(newOrder);
      
      // Auto-save to store
      await setSessionVotes(`race-${race.round}-position-`, userId, newOrder.map(d => d.id));
    }
  };

  if (loading) {
    return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="animate-pulse text-[#E60000] font-black text-xl">LOADING GRID...</div>
        </div>
    );
  }

  return (
    <div className="pb-32 pt-6 px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase leading-tight mb-2">
          {race.name}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xs font-bold bg-[#2C2C2E] text-white px-3 py-1 rounded-lg border border-white/10">
            Round {race.round}
          </span>
          <span className={clsx(
            "text-xs font-bold px-3 py-1 rounded-lg border",
            isLocked 
              ? "bg-[#E60000] text-white border-[#E60000]"
              : "bg-[#E60000]/10 text-[#E60000] border-[#E60000]/20"
          )}>
            ⏱ {timeLeft || "Loading..."}
          </span>
        </div>
        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">
          {isLocked 
            ? "Grid is locked. Race has started." 
            : "Drag & Drop to set your grid. Changes save instantly."}
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedDrivers.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 gap-2 mb-6">
            {orderedDrivers.map((driver, index) => (
              <SortableDriverItem 
                key={driver.id} 
                driver={driver} 
                index={index} 
                disabled={isLocked}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableDriverItem({ driver, index, disabled }: { driver: Driver; index: number; disabled?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: driver.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        "flex items-center p-3 rounded-2xl transition touch-manipulation select-none border border-white/5",
        "bg-[#1C1C1E]",
        !disabled && "cursor-move",
        driver.color.replace("bg-", "border-l-4 border-"),
        isDragging && "opacity-90 scale-95 shadow-2xl z-50 ring-2 ring-[#E60000]"
      )}
    >
      <div className={clsx(
        "w-10 h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 font-black text-xl",
        index < 3 ? "bg-[#E60000] text-white" : "bg-[#2C2C2E] text-gray-500"
      )}>
        <span>{index + 1}</span>
      </div>

      <span className="text-lg font-bold w-10 text-gray-600 flex-shrink-0">
        #{driver.number}
      </span>

      <div className="text-left flex-1 min-w-0">
        <div className="font-bold text-base text-white truncate flex items-center gap-1">
          <span>{driver.country}</span>
          <span>{driver.name}</span>
        </div>
        <div className="text-xs text-gray-500 uppercase truncate font-medium">{driver.team}</div>
      </div>

      <div className={clsx("w-1.5 h-8 rounded-full ml-2 flex-shrink-0 opacity-80", driver.color.split(" ")[0])} />
      
      {!disabled && (
        <div className="ml-2 text-gray-600 flex-shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
            </svg>
        </div>
      )}
    </div>
  );
}
