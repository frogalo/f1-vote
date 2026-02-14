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

function SortableDriverItem({ driver, index }: { driver: Driver; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: driver.id });

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
        "flex items-center p-3 rounded-lg border-l-4 bg-slate-800 transition cursor-move touch-manipulation select-none",
        driver.color.replace("bg-", "border-"),
        isDragging && "opacity-50 scale-95 shadow-2xl z-50"
      )}
    >
      {/* Position Number */}
      <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center mr-3 flex-shrink-0">
        <span className="text-xl font-black text-cyan-400">
          {index + 1}
        </span>
      </div>

      {/* Driver Number */}
      <span className="text-lg font-bold w-10 text-slate-500 flex-shrink-0">
        #{driver.number}
      </span>

      {/* Driver Info */}
      <div className="text-left flex-1 min-w-0">
        <div className="font-bold text-base leading-tight truncate flex items-center gap-1">
          <span>{driver.country}</span>
          <span>{driver.name}</span>
        </div>
        <div className="text-xs text-slate-400 uppercase truncate">{driver.team}</div>
      </div>

      {/* Team Stripe */}
      <div className={clsx("w-2 h-8 rounded-full ml-2 flex-shrink-0", driver.color.split(" ")[0])} />

      {/* Drag Indicator */}
      <div className="ml-2 text-slate-600 flex-shrink-0">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </div>
    </div>
  );
}

export default function SeasonVotePage() {
  const { drivers, addVote, loadFromIndexedDB } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderedDrivers, setOrderedDrivers] = useState(drivers);

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
    loadFromIndexedDB().then(() => setLoading(false));
  }, [loadFromIndexedDB]);

  useEffect(() => {
    setOrderedDrivers(drivers);
  }, [drivers]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedDrivers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = async () => {
    // Save the top 10 predictions
    const top10 = orderedDrivers.slice(0, 10);

    // Store as a special vote type for season predictions
    for (let i = 0; i < top10.length; i++) {
      await addVote({
        driverId: top10[i].id,
        raceRound: `season-position-${i + 1}`
      });
    }

    alert(`✅ Twoje przewidywania zapisane!\nTwoja TOP 10:\n${top10.map((d, i) => `${i + 1}. ${d.name}`).join('\n')}`);
    router.push("/leaderboard");
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 pb-24">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-800 rounded-lg w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="pb-32">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent uppercase">
          Przewidywania Sezonu 2026
        </h1>
        <p className="text-slate-400 text-sm mb-1">
          Przeciągnij kierowców aby przewidzieć kolejność w mistrzostwach
        </p>
        <p className="text-cyan-400 text-xs font-bold">
          📍 Twoja TOP 10 zostanie zapisana
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
          <div className="grid grid-cols-1 gap-3 mb-6">
            {orderedDrivers.map((driver, index) => (
              <SortableDriverItem key={driver.id} driver={driver} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Fixed Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pointer-events-none">
        <button
          onClick={handleSubmit}
          className="w-full max-w-md mx-auto pointer-events-auto bg-gradient-to-r from-red-600 to-orange-600 text-white font-black py-4 rounded-xl shadow-lg shadow-red-500/30 active:scale-95 transition-transform uppercase tracking-wide text-lg flex items-center justify-center gap-2"
        >
          <span>🏆</span>
          <span>Zapisz Moje Typy</span>
        </button>
      </div>
    </div>
  );
}
