import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/app/components/Nav";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "F1 Typy 2026",
  description: "Typuj i przewiduj wyniki sezonu F1 2026",
  manifest: "/manifest.webmanifest",
  applicationName: "F1 Typy",
  appleWebApp: {
    capable: true,
    title: "F1 Typy",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "F1 Typy 2026",
    description: "Czas na wyścig. Wejdź i podaj swoich faworytów!",
    type: "website",
    siteName: "F1 Typy 2026",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "F1 Typy 2026",
    description: "Typuj i przewiduj wyniki sezonu F1 2026!",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
  userScalable: true,
};

import { prisma } from "@/lib/prisma";
import { hasCompletedSeasonPicks } from "@/app/actions/seasonVote";
import SeasonGuard from "@/app/components/SeasonGuard";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let nextRound = 1;
  let isComplete = true; // Default to true (allows safe fallback)
  
  try {
    const races = await prisma.race.findMany({ select: { round: true, date: true } });
    nextRound = races.sort((a, b) => a.round - b.round).find(r => new Date(r.date) > new Date())?.round || 1;
  } catch (error) {
    console.warn("Could not fetch races for layout. Defaulting nextRound to 1.");
  }

  try {
    isComplete = await hasCompletedSeasonPicks();
  } catch (error) {
    console.warn("Could not check if picks are completed. Defaulting to true.");
  }

  return (
    <html lang="pl">
      <body className="min-h-screen text-base md:text-lg bg-[#0D0D0D] text-white">
        <Toaster position="top-center" richColors theme="dark" closeButton />
        <div className="md:pt-16 pb-20 md:pb-0">
          <AuthProvider>
            <SeasonGuard isComplete={isComplete} />
            <Nav nextRound={nextRound} hidden={!isComplete} />
            <main className="max-w-md mx-auto p-4 md:max-w-4xl min-h-[calc(100vh-80px)]">
              {children}
            </main>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
