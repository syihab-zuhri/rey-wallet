"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setEmail(user.email || "");
    }
    getUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">Pengaturan</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Akun Saya</h2>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
          <button className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">
            Edit
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Aplikasi</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-gray-700">Versi</span>
              <span className="text-sm text-gray-500">1.0.0</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-gray-700">Developer</span>
              <span className="text-sm text-gray-500">rey-wallet</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Keluar (Logout)
        </button>
      </div>
    </div>
  );
}
