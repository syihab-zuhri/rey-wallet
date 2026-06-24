"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  // Do not show bottom nav on auth pages AND transaction form page
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/auth') ||
    pathname === '/transactions/new'
  ) {
    return null;
  }

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/history", label: "Riwayat", icon: History },
    { href: "/transactions/new", label: "Tambah", icon: PlusCircle, isMain: true },
    { href: "/settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          if (link.isMain) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-center -mt-8"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-200 text-white hover:bg-blue-700 transition-colors">
                  <Icon className="w-7 h-7" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full space-y-1 text-xs",
                isActive ? "text-blue-600 font-medium" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "stroke-2")} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
