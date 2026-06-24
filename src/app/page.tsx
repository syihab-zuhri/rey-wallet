"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatRupiah, cn } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle, Wallet, Plus, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      // Get current month date range
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();

      const { data, error } = await supabase
        .from("transactions")
        .select(`
          id, amount, type, notes, date,
          categories (name, icon)
        `)
        .gte("date", firstDay)
        .lte("date", lastDay)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTransactions(data as unknown as Transaction[]);

        // Calculate summary
        const calc = data.reduce(
          (acc, curr) => {
            if (curr.type === "income") acc.income += Number(curr.amount);
            else acc.expense += Number(curr.amount);
            return acc;
          },
          { income: 0, expense: 0 }
        );

        setSummary({
          ...calc,
          balance: calc.income - calc.expense
        });
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // Single chart data: income vs expense percentage comparison
  const comparisonChartData = useMemo(() => {
    const { income, expense } = summary;
    if (income === 0 && expense === 0) return [];

    return [
      { name: "Pemasukan", value: income, color: "#10B981" },
      { name: "Pengeluaran", value: expense, color: "#F59E0B" },
    ].filter((item) => item.value > 0);
  }, [summary]);

  const totalIncomeExpense = summary.income + summary.expense;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section with blue gradient */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-700 pt-12 pb-24 px-6 rounded-b-[2.5rem]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-blue-100 text-sm">Total Saldo</p>
            <h1 className="text-3xl font-bold text-white mt-1">
              {formatRupiah(summary.balance)}
            </h1>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Wallet className="text-white w-6 h-6" />
          </div>
        </div>

        {/* Income & Expense Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-white/80 text-xs font-medium">Pemasukan</span>
            </div>
            <p className="text-white font-semibold">{formatRupiah(summary.income)}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpCircle className="w-5 h-5 text-red-400" />
              <span className="text-white/80 text-xs font-medium">Pengeluaran</span>
            </div>
            <p className="text-white font-semibold">{formatRupiah(summary.expense)}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 -mt-10 bg-gray-50 rounded-t-[2.5rem] pt-6 relative z-10 pb-8">

        {/* Statistics Section - Single comparison chart */}
        {!loading && comparisonChartData.length >= 2 && (
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-bold text-gray-900">Statistik Bulan Ini</h2>
              <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                <TrendingUp className="w-4 h-4" />
                <span>Perbandingan</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
              {/* Donut Chart */}
              <div className="w-28 h-28 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={comparisonChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {comparisonChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with percentages */}
              <div className="ml-6 flex-1 space-y-3">
                {comparisonChartData.map((item) => {
                  const percent = totalIncomeExpense > 0
                    ? Math.round((item.value / totalIncomeExpense) * 100)
                    : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">{percent}%</span>
                        <span className="text-xs text-gray-500 ml-1">
                          {formatRupiah(item.value)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions List */}
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-gray-900">Transaksi Terakhir</h2>
          <Link href="/history" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <PieChartIcon className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 mb-4 text-sm px-8">Mulai catat transaksi untuk melihat statistik keuangan Anda</p>
            <Link
              href="/transactions/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4" /> Tambah Transaksi
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">
                      {t.notes || "Tidak ada catatan"}
                    </p>
                    <span className="text-gray-300">•</span>
                    <p className="text-xs text-gray-500">
                      {format(new Date(t.date), "d MMM", { locale: id })}
                    </p>
                  </div>
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
        )}
      </div>
    </div>
  );
}
