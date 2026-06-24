import { BottomNav } from "@/components/layout/bottom-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-md mx-auto min-h-screen bg-white shadow-sm sm:border-x sm:border-gray-100 relative">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
