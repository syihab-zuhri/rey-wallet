"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
};

export default function NewTransactionPage() {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [notes, setNotes] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function fetchCategories() {
      // Fetch user specific categories
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // The default category set we want to ensure exists for every user
      const defaultCategories = [
        { user_id: user.id, name: "Makanan", type: "expense", icon: "🍜" },
        { user_id: user.id, name: "Transport", type: "expense", icon: "🚗" },
        { user_id: user.id, name: "Belanja", type: "expense", icon: "🛒" },
        { user_id: user.id, name: "Tagihan", type: "expense", icon: "🧾" },
        { user_id: user.id, name: "Lainnya", type: "expense", icon: "📦" },
        { user_id: user.id, name: "Gaji", type: "income", icon: "💰" },
        { user_id: user.id, name: "Bonus", type: "income", icon: "🎉" },
        { user_id: user.id, name: "Lainnya", type: "income", icon: "💎" },
      ];

      const { data: existing } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      const existingList = existing || [];

      // Find any default category that is missing on this user account (by name+type)
      const missingCategories = defaultCategories.filter(
        (def) => !existingList.some((ex) => ex.name === def.name && ex.type === def.type)
      );

      let finalCategories = existingList;

      // If anything is missing (e.g. existing users that signed up before "Lainnya" was added), insert them
      if (missingCategories.length > 0) {
        const { data: inserted } = await supabase
          .from("categories")
          .insert(missingCategories)
          .select();

        if (inserted) finalCategories = [...existingList, ...inserted];
      }

      // Remove duplicates by (name, type) as a safety net for older double-inserted rows
      const uniqueCategories = finalCategories.filter(
        (cat, index, self) =>
          index === self.findIndex((c) => c.name === cat.name && c.type === cat.type)
      );

      if (isMounted) {
        setCategories(uniqueCategories);
        setLoading(false);
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle amount formatting to fix jumping cursor issue
  const [displayAmount, setDisplayAmount] = useState("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setAmount(val);
    setDisplayAmount(val ? new Intl.NumberFormat("id-ID").format(Number(val)) : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();

    if (!amount || Number(amount) <= 0) {
      setError("Nominal harus lebih dari 0");
      setSubmitting(false);
      return;
    }

    if (!categoryId) {
      setError("Pilih kategori terlebih dahulu");
      setSubmitting(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("User tidak ditemukan, silakan login ulang");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        category_id: categoryId,
        amount: Number(amount),
        type,
        date,
        notes: notes.trim() || null,
      });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex-none flex items-center justify-between">
        <Link href="/" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-bold text-gray-900">Catat Transaksi</h1>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 space-y-6 pb-6">
          {/* Type Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => { setType("expense"); setCategoryId(""); }}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
              type === "expense" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"
            )}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => { setType("income"); setCategoryId(""); }}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
              type === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"
            )}
          >
            Pemasukan
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {/* Amount Input */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 text-center">
            Nominal
          </label>
          <div className="flex items-center justify-center text-4xl font-bold">
            <span className="text-gray-400 mr-2 text-2xl">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={displayAmount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full text-center outline-none bg-transparent text-gray-900 placeholder-gray-300"
              autoFocus
            />
          </div>
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Category Grid */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                    categoryId === cat.id
                      ? (type === "expense" ? "bg-orange-50 border-orange-200" : "bg-emerald-50 border-emerald-200")
                      : "bg-white border-gray-100 hover:bg-gray-50"
                  )}
                >
                  <span className="text-2xl mb-1">{cat.icon}</span>
                  <span className={cn(
                    "text-[10px] font-medium text-center line-clamp-1",
                    categoryId === cat.id
                      ? (type === "expense" ? "text-orange-700" : "text-emerald-700")
                      : "text-gray-600"
                  )}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notes Input */}
        <div className="pb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tulis detail transaksi..."
            rows={2}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
        </div> {/* End of scrollable area */}

        {/* Save Button Container */}
        <div className="flex-none p-4 bg-white border-t border-gray-100 pb-safe">
          <button
            type="submit"
            disabled={submitting || loading || !amount || !categoryId}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Simpan Transaksi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
