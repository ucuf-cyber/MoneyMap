"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatIDR } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-count-up";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import type { WeddingBudgetItem, SavingsGoal } from "@/lib/types";

export function WeddingSummary({ items, weddingGoal }: { items: WeddingBudgetItem[]; weddingGoal?: SavingsGoal }) {
  const totalEstimated = items.reduce((s, i) => s + i.estimatedCost, 0);
  const totalActual = items.reduce((s, i) => s + i.actualCost, 0);
  const totalPaid = items.reduce((s, i) => s + i.paidAmount, 0);
  const totalRemaining = totalActual - totalPaid;
  const savingsAvailable = weddingGoal?.currentAmount ?? 0;
  const coveragePct = totalActual > 0 ? Math.min((savingsAvailable / totalActual) * 100, 100) : 0;
  const shortfall = totalRemaining - savingsAvailable;

  const animatedEstimated = useCountUp(totalEstimated);
  const animatedPaid = useCountUp(totalPaid);
  const animatedRemaining = useCountUp(Math.max(totalRemaining, 0));
  const animatedSavings = useCountUp(savingsAvailable);

  return (
    <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StaggerItem>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Estimasi Budget</p>
            <p className="mt-2 text-2xl font-bold">{formatIDR(Math.round(animatedEstimated))}</p>
          </CardContent>
        </Card>
      </StaggerItem>
      <StaggerItem>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Sudah Dibayar</p>
            <p className="mt-2 text-2xl font-bold text-emerald-400">{formatIDR(Math.round(animatedPaid))}</p>
          </CardContent>
        </Card>
      </StaggerItem>
      <StaggerItem>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Sisa Dana Dibutuhkan</p>
            <p className="mt-2 text-2xl font-bold text-red-400">{formatIDR(Math.round(animatedRemaining))}</p>
          </CardContent>
        </Card>
      </StaggerItem>
      <StaggerItem>
        <Card className="bg-gradient-to-br from-[#FF6B35] to-[#FFC93C] text-black">
          <CardContent className="p-6">
            <p className="text-sm font-medium opacity-80">Tabungan &quot;Nikah&quot; vs Kebutuhan</p>
            <p className="mt-2 text-xl font-bold">{formatIDR(Math.round(animatedSavings))}</p>
            <Progress value={coveragePct} className="mt-3 bg-black/15" />
            <p className="mt-2 text-xs opacity-80">
              {shortfall > 0
                ? `Masih kurang ${formatIDR(shortfall)} dari tabungan nikahmu`
                : "Tabungan nikahmu sudah cukup! 🎉"}
            </p>
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerGrid>
  );
}
