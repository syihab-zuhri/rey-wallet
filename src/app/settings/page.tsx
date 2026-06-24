"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User, X, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalMode = "email" | "password" | null;

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setEmail(user.email || "");
    }
    getUser();
  }, []);

  useEffect(() => {
    if (modalMode === "email") {
      setNewEmail(email);
      setError(null);
      setSuccess(null);
    } else if (modalMode === "password") {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      setSuccess(null);
    }
  }, [modalMode, email]);

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!newEmail || newEmail === email) {
      setSubmitting(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(`Email konfirmasi telah dikirim ke ${newEmail}. Cek inbox Anda.`);
    }
    setSubmitting(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError("Masukkan password saat ini");
      setSubmitting(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      setSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi tidak cocok");
      setSubmitting(false);
      return;
    }

    // First verify current password by trying to sign in
    const supabase = createClient();

    // Try to re-authenticate with current password first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      setError("Password saat ini salah");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password berhasil diperbarui!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSubmitting(false);
  };

  const closeModal = () => {
    setModalMode(null);
    setError(null);
    setSuccess(null);
  };

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
          <button
            onClick={() => setModalMode("email")}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Keamanan</h3>
          </div>
          <button
            onClick={() => setModalMode("password")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Ubah Password</span>
            </div>
            <span className="text-xs text-blue-600 font-medium">Ganti</span>
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

      {/* Modal: Change Email */}
      {modalMode === "email" && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Ubah Email</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 text-sm p-3 rounded-lg border border-emerald-100 mb-4">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            <form onSubmit={handleChangeEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Baru</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newEmail || newEmail === email}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
            {success && (
              <button
                onClick={closeModal}
                className="w-full mt-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal: Change Password */}
      {modalMode === "password" && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Ubah Password</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 text-sm p-3 rounded-lg border border-emerald-100 mb-4">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Password saat ini"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Minimal 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(
                      "w-full bg-gray-50 border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                      confirmPassword && newPassword !== confirmPassword
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    )}
                    placeholder="Ketik ulang password baru"
                  />
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 ml-1">Password tidak cocok</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || !currentPassword || !newPassword || newPassword !== confirmPassword}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                    </span>
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
            {success && (
              <button
                onClick={closeModal}
                className="w-full mt-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
