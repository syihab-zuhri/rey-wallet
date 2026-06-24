"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatRupiah, cn } from "@/lib/utils";
import { History, Filter } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  notes: string;
  date: string;
  categories: {
    name: string;
    icon: string;
  };
};

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          id, amount, type, notes, date,
          categories (name, icon)
        `)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTransactions(data as any);
      }
      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  // Group transactions by Date
  const groupedTransactions = transactions.reduce((acc, curr) => {
    const dateStr = curr.date;
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(curr);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-20 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Riwayat Transaksi</h1>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 pt-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <History className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500">Belum ada riwayat transaksi</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTransactions).map(([dateStr, items]) => (
              <div key={dateStr}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ml-1">
                  {format(parseISO(dateStr), "EEEE, dd MMMM yyyy", { locale: id })}
                </h3>
                <div className="space-y-3">
                  {items.map((t) => (
                    <div key={t.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0",
                        t.type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                      )}>
                        {t.categories?.icon || (t.type === "income" ? "💰" : "🛒")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {t.categories?.name || "Lainnya"}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {t.notes || "Tidak ada catatan"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={cn(
                          "font-semibold text-sm",
                          t.type === "income" ? "text-emerald-600" : "text-gray-900"
                        )}>
                          {t.type === "income" ? "+" : "-"}{formatRupiah(t.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
