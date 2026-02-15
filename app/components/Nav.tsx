"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Home, Calendar, Flag, Trophy, User, Shield } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { races } from '@/lib/data';

export default function Nav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading || !user) return null;
  if (pathname === "/login" || pathname === "/register") return null;

  // Use the races calendar to determine the next upcoming race
  const nextRound = races.find(r => new Date(r.date) > new Date())?.round || 1;

  const tabs = [
    { name: 'Sezon', href: '/season', icon: Home },
    { name: 'Kalendarz', href: '/calendar', icon: Calendar },
    { name: 'Wyścig', href: `/race/${nextRound}`, icon: Flag, isFab: true },
    { name: 'Ranking', href: '/leaderboard', icon: Trophy },
    { name: 'Profil', href: '/profile', icon: User },
  ];

  return (
    <>
      {/* Admin floating button */}
      {user.isAdmin && (
        <Link
          href="/admin"
          className={clsx(
            "fixed top-4 right-4 z-[55] p-3 rounded-2xl border transition-all active:scale-95 shadow-lg",
            pathname === "/admin"
              ? "bg-[#E60000] border-red-500 shadow-red-900/30"
              : "bg-[#1C1C1E]/90 backdrop-blur-xl border-white/10 hover:bg-[#2C2C2E] shadow-black/20"
          )}
          title="Panel Admina"
        >
          <Shield className={clsx("w-5 h-5", pathname === "/admin" ? "text-white" : "text-[#E60000]")} />
        </Link>
      )}

      <nav className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-50">
        <div className="bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/5 rounded-3xl h-20 shadow-2xl flex items-center justify-between px-2 relative">

          {tabs.map((tab, idx) => {
            const isActive = pathname === tab.href || (tab.href !== '/season' && pathname.startsWith(tab.href));

            if (tab.isFab) {
              return (
                <div key={tab.name} className="relative -top-8">
                  <Link
                    href={tab.href}
                    className={clsx(
                      "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 border-4 border-[#0D0D0D]",
                      isActive ? "bg-red-600 shadow-red-600/40" : "bg-red-600 shadow-red-600/40"
                    )}
                  >
                    <tab.icon className="w-8 h-8 text-white" />
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={clsx(
                  "flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors",
                  isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                )}
              >
                <div className={clsx("transition-all duration-300", isActive ? "-translate-y-1" : "")}>
                  <tab.icon className="w-6 h-6" />
                </div>
                {isActive && (
                  <span className="text-[10px] font-medium absolute bottom-3 transition-opacity duration-300 opacity-100">
                    {tab.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

