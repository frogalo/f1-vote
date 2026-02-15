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
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="min-h-screen text-base md:text-lg bg-[#0D0D0D] text-white">
        <Toaster position="top-center" richColors theme="dark" closeButton />
        {/* Mobile: Top spacing for content, nav at bottom. Desktop: Top nav. */}
        <div className="md:pt-16 pb-20 md:pb-0">
          <AuthProvider>
            <Nav />
            <main className="max-w-md mx-auto p-4 md:max-w-4xl min-h-[calc(100vh-80px)]">
              {children}
            </main>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
