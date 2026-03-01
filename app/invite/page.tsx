import { Metadata } from "next";
import LandingClient from "@/app/LandingClient";

export const metadata: Metadata = {
  title: "F1 Typy 2026 - Dołącz do gry!",
  description: "Załóż darmowe konto, wytypuj klasyfikację końcową kierowców na ten sezon i rywalizuj ze znajomymi w F1 Vote!",
  openGraph: {
    title: "F1 Typy 2026 - Dołącz do gry",
    description: "Czas na wyścigi. Zaloguj się i podaj swoich faworytów!",
    type: "website",
    siteName: "F1 Typy 2026",
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/invite` : "https://f1.jakub-urbanski.me/invite",
  },
  twitter: {
    card: "summary_large_image",
    title: "F1 Typy 2026 - Dołącz do gry!",
    description: "Załóż darmowe konto, wytypuj klasyfikację końcową kierowców na ten sezon i rywalizuj ze znajomymi w F1 Vote!",
  }
};

export default function InvitePage() {
    return <LandingClient />;
}
