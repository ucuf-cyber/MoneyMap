"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatIDR } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-count-up";
import { Wallet, TrendingDown, TrendingUp } from "lucide-react";

export function BigSummaryCard({
  balance,
  totalExpense,
  totalIncome,
  savingsProgressPct,
}: {
  balance: number;
  totalExpense: number;
  totalIncome: number;
  savingsProgressPct: number;
}) {
  const animatedBalance = useCountUp(balance);
  const animatedIncome = useCountUp(totalIncome);
  const animatedExpense = useCountUp(totalExpense);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-[#FF6B35] to-[#FFC93C] text-black">
      <CardContent className="flex h-full flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium opacity-80">Ringkasan Bulan Ini</span>
          <Wallet className="h-5 w-5 opacity-70" />
        </div>

        <div className="mt-4">
          <p className="text-xs opacity-70">Sisa Saldo</p>
          <p className="text-4xl font-bold tracking-tight">{formatIDR(Math.round(animatedBalance))}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-black/10 p-3">
            <div className="flex items-center gap-1.5 text-xs opacity-80">
              <TrendingUp className="h-3.5 w-3.5" /> Pemasukan
            </div>
            <p className="mt-1 text-lg font-semibold">{formatIDR(Math.round(animatedIncome))}</p>
          </div>
          <div className="rounded-2xl bg-black/10 p-3">
            <div className="flex items-center gap-1.5 text-xs opacity-80">
              <TrendingDown className="h-3.5 w-3.5" /> Pengeluaran
            </div>
            <p className="mt-1 text-lg font-semibold">{formatIDR(Math.round(animatedExpense))}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-80">Progress Tabungan</span>
            <span className="font-semibold">{savingsProgressPct.toFixed(0)}%</span>
          </div>
          <Progress value={Math.min(savingsProgressPct, 100)} className="mt-2 bg-black/15" />
        </div>
      </CardContent>
    </Card>
  );
}
