import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/bottom-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "rey-wallet",
  description: "Personal Finance Tracker",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "rey-wallet",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 pb-20">
          <main className="max-w-md mx-auto min-h-screen bg-white shadow-sm sm:border-x sm:border-gray-100 relative">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
