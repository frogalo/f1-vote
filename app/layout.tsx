import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/app/components/Nav";

export const metadata: Metadata = {
  title: "F1 2025 Vote",
  description: "Vote for your favorite 2025 season winner",
  manifest: "/manifest.webmanifest",
  applicationName: "F1 Vote",
  appleWebApp: {
    capable: true,
    title: "F1 Vote",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen text-base md:text-lg">
        {/* Mobile: Top spacing for content, nav at bottom. Desktop: Top nav. */}
        <div className="md:pt-16 pb-20 md:pb-0">
          <Nav />
          <main className="max-w-md mx-auto p-4 md:max-w-2xl min-h-[calc(100vh-80px)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
