"use client";

import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Driver } from "@/lib/data";

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
      {/* Position Number */}
      <div className={clsx(
        "w-10 h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 font-black text-xl",
        index < 3 ? "bg-[#E60000] text-white" : "bg-[#2C2C2E] text-gray-500"
      )}>
        <span>{index + 1}</span>
      </div>

      {/* Driver Number */}
      <span className="text-lg font-bold w-10 text-gray-600 flex-shrink-0">
        #{driver.number}
      </span>

      {/* Driver Info */}
      <div className="text-left flex-1 min-w-0">
        <div className="font-bold text-base leading-tight truncate flex items-center gap-1 text-white">
          <span>{driver.country}</span>
          <span>{driver.name}</span>
        </div>
        <div className="text-xs text-gray-500 uppercase truncate font-medium">{driver.team}</div>
      </div>

      {/* Team Stripe */}
      <div className={clsx("w-1.5 h-8 rounded-full ml-2 flex-shrink-0 opacity-80", driver.color.split(" ")[0])} />

      {/* Drag Indicator */}
      {!disabled && (
        <div className="ml-2 text-gray-600 flex-shrink-0">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function SeasonVotePage() {
  const { drivers, votes, userId, setSessionVotes, loadFromIndexedDB } = useStore();
  const [loading, setLoading] = useState(true);
  const [orderedDrivers, setOrderedDrivers] = useState(drivers);
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
      // Round 1 date is March 8, 2026. Lock after that.
      const round1Date = new Date("2026-03-08T05:00:00Z");
      setIsLocked(Date.now() > round1Date.getTime());
    });
  }, [loadFromIndexedDB]);

  // Restore previous order from votes
  useEffect(() => {
    if (loading) return;
    
    const seasonVotes = votes.filter(v => 
      v.userId === userId && String(v.raceRound).startsWith("season-position-")
    );

    if (seasonVotes.length > 0) {
      const restored = [...drivers].sort((a, b) => {
        const voteA = seasonVotes.find(v => v.driverId === a.id);
        const voteB = seasonVotes.find(v => v.driverId === b.id);
        const posA = voteA ? parseInt(String(voteA.raceRound).split("-")[2]) : 999;
        const posB = voteB ? parseInt(String(voteB.raceRound).split("-")[2]) : 999;
        return posA - posB;
      });
      setOrderedDrivers(restored);
    } else {
      setOrderedDrivers(drivers);
    }
  }, [loading, votes, userId, drivers]);

  const handleDragEnd = async (event: DragEndEvent) => {
    if (isLocked) return;
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedDrivers.findIndex((item) => item.id === active.id);
      const newIndex = orderedDrivers.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(orderedDrivers, oldIndex, newIndex);
      
      setOrderedDrivers(newOrder);
      
      // Auto-save to store
      await setSessionVotes("season-position-", userId, newOrder.map(d => d.id));
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 pb-24 pt-8 px-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-[#1C1C1E] rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="pb-32 pt-8">
      <div className="mb-6 px-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Season <span className="text-[#E60000]">2026</span>
          </h1>
          {isLocked && (
            <span className="bg-[#E60000]/10 text-[#E60000] text-[10px] font-bold px-2 py-1 rounded-lg border border-[#E60000]/20 flex items-center gap-1">
              <span>🔒</span> LOCKED
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm mb-4 font-medium">
          {isLocked 
            ? "Season has started. Predictions are locked."
            : "Drag & Drop to predict the championship order. Saved automatically."}
        </p>
        {!isLocked && (
            <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-3 flex items-start gap-3">
              <div className="text-[#E60000] text-xl">ℹ️</div>
              <div className="text-xs text-gray-400">
                Predict the <strong>Top 10</strong> drivers correctly to earn maximum points. Changes save instantly.
              </div>
            </div>
        )}
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
          <div className="grid grid-cols-1 gap-2 mb-6 px-4">
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
