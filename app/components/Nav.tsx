"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export default function Nav() {
  const pathname = usePathname();
  
  const tabs = [
    { name: 'Season', href: '/season' },
    { name: 'Next Race', href: '/race/1' }, 
    { name: 'Leaderboard', href: '/leaderboard' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 pb-safe md:top-0 md:bottom-auto md:border-b md:border-t-0 z-50">
      <div className="flex justify-around max-w-md mx-auto md:max-w-2xl h-16 items-center">
        {tabs.map((tab) => {
          // Improve active check logic
          const isActive = pathname === tab.href || (tab.href !== '/season' && pathname.startsWith(tab.href));
          return (
            <Link 
              key={tab.name}
              href={tab.href}
              className={clsx(
                "flex-1 text-center h-full flex items-center justify-center text-sm font-bold transition-colors uppercase tracking-wider",
                isActive ? "text-blue-400 border-t-2 border-blue-400 md:border-t-0 md:border-b-2" : "text-slate-500 hover:text-slate-300 border-t-2 border-transparent md:border-t-0 md:border-b-2"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
