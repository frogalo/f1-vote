"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
// Simple SVG icons for better customization
const TrophyIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> {/* Clock/Time for Season? Or keep Trophy */}
    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /> {/* Star/Trophy mix */}
  </svg>
);
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
// Flag for Race
const FlagIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-8a2 2 0 012-2h10a2 2 0 012 2v8m2-2a2 2 0 01-2-2H5a2 2 0 01-2 2m0-16l14 5-14 5V5z" />
  </svg>
);
const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
  </svg>
);

export default function Nav() {
  const pathname = usePathname();

  const { raceResults } = require("@/lib/mockData");
  const nextRound = raceResults.length + 1;

  const tabs = [
    { name: 'Home', href: '/season', icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    // Center button will be handled separately in the layout
    { name: 'Race', href: `/race/${nextRound}`, icon: FlagIcon, isFab: true }, 
    { name: 'Standings', href: '/leaderboard', icon: ChartIcon },
    { name: 'Profile', href: '/profile', icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  ];

  return (
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
  );
}
