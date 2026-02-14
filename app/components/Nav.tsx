"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export default function Nav() {
  const pathname = usePathname();

  const { raceResults } = require("@/lib/mockData");
  const nextRound = raceResults.length + 1;

  const tabs = [
    { name: 'Sezon', href: '/season', icon: '🏆' },
    { name: 'Kalendarz', href: '/calendar', icon: '📅' },
    { name: 'Wyścig', href: `/race/${nextRound}`, icon: '🏁' },
    { name: 'Wyniki', href: '/leaderboard', icon: '📊' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 pb-safe md:top-0 md:bottom-auto md:border-b md:border-t-0 z-50">
      <div className="flex justify-around max-w-md mx-auto md:max-w-4xl h-16 items-center px-2">
        {tabs.map((tab) => {
          // Improve active check logic
          const isActive = pathname === tab.href || (tab.href !== '/season' && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={clsx(
                "flex-1 h-full flex flex-col items-center justify-center gap-0.5 text-xs font-bold transition-all uppercase tracking-wide min-w-0",
                isActive ? "text-cyan-400 scale-105" : "text-slate-500 hover:text-slate-300 active:scale-95"
              )}
            >
              <span className="text-xl md:text-2xl">{tab.icon}</span>
              <span className="text-[10px] md:text-xs truncate max-w-full px-1">{tab.name}</span>
              {isActive && <div className="w-6 h-0.5 bg-cyan-400 rounded-full mt-0.5" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
