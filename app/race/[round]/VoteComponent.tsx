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
        isDragging && "opacity-50 scale-95 shadow-2xl z-50 ring-2 ring-cyan-500"
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center mr-3 flex-shrink-0">
        <span className="text-xl font-black text-cyan-400">
          {index + 1}
        </span>
      </div>

      <span className="text-lg font-bold w-10 text-slate-500 flex-shrink-0">
        #{driver.number}
      </span>

      <div className="text-left flex-1 min-w-0">
        <div className="font-bold text-base leading-tight truncate flex items-center gap-1">
          <span>{driver.country}</span>
          <span>{driver.name}</span>
        </div>
        <div className="text-xs text-slate-400 uppercase truncate">{driver.team}</div>
      </div>

      <div className={clsx("w-2 h-8 rounded-full ml-2 flex-shrink-0", driver.color.split(" ")[0])} />
    </div>
  );
}

export function VoteComponent({ race, drivers }: Props) {
  const { addVote, loadFromIndexedDB } = useStore();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");
  const [voted, setVoted] = useState(false);
  const [orderedDrivers, setOrderedDrivers] = useState(drivers);
  const [loading, setLoading] = useState(true);

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
    const fp1Time = new Date(race.date).getTime() - 48 * 60 * 60 * 1000;
    const interval = setInterval(() => {
      const diff = fp1Time - Date.now();
      if (diff <= 0) {
        setTimeLeft("GO!");
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    }, 1000);
    return () => clearInterval(interval);
  }, [race]);

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
    if (voted) return;
    setVoted(true);

    // Save ALL positions for the race prediction
    for (let i = 0; i < orderedDrivers.length; i++) {
      await addVote({
        driverId: orderedDrivers[i].id,
        raceRound: `race-${race.round}-position-${i + 1}`
      });
    }

    alert(`✅ Głosy na Runda ${race.round} zapisane!`);
    router.push("/calendar");
  };

  if (loading) return null;

  return (
    <div className="pb-32">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 uppercase leading-tight">
          Głosowanie: {race.name}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-xs font-mono text-cyan-400 font-bold bg-slate-800 px-3 py-1 rounded-full border border-slate-700 shadow-sm">
            Runda {race.round}
          </span>
          <span className="text-xs font-mono text-orange-400 font-bold bg-slate-800 px-3 py-1 rounded-full border border-slate-700 shadow-sm">
            ⏱ {timeLeft}
          </span>
        </div>
        <p className="text-slate-400 text-xs mt-3 uppercase tracking-widest font-bold">
          Ustaw kolejność kierowców (Drag & Drop)
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
              <SortableDriverItem key={driver.id} driver={driver} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Fixed Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pointer-events-none z-40">
        <button
          onClick={handleSubmit}
          disabled={voted}
          className="w-full max-w-md mx-auto pointer-events-auto bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black py-4 rounded-xl shadow-lg shadow-cyan-500/30 active:scale-95 transition-all uppercase tracking-widest text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
        >
          <span>🏁</span>
          <span>Zatwierdź Grid</span>
        </button>
      </div>
    </div>
  );
}
