"use client";

import { Card, CardContent } from "@/components/ui/card";
import { WeddingSummary } from "@/components/wedding/wedding-summary";
import { BudgetTable } from "@/components/wedding/budget-table";
import { AddItemDialog } from "@/components/wedding/add-item-dialog";
import { ImportExportButtons } from "@/components/wedding/import-export-buttons";
import { GiftTable } from "@/components/wedding/gift-table";
import { AddGiftDialog } from "@/components/wedding/add-gift-dialog";
import { PageTransition } from "@/components/motion/page-transition";
import { useWeddingItems, useSavingsGoals, useWeddingGifts } from "@/hooks/use-data";

export default function WeddingPage() {
  const { data: items = [], isLoading } = useWeddingItems();
  const { data: goals = [] } = useSavingsGoals();
  const { data: gifts = [], isLoading: giftsLoading } = useWeddingGifts();
  const weddingGoal = goals.find((g) => g.isWeddingGoal);

  return (
    <PageTransition>
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Wedding Budget Planner</h1>
          <p className="text-sm text-muted-foreground">
            Rencanakan budget nikahmu otomatis, terhubung dengan tabungan &quot;Nikah&quot;.
          </p>
        </div>
        <ImportExportButtons />
      </div>

      <WeddingSummary items={items} weddingGoal={weddingGoal} />

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Rincian Budget</h2>
            <AddItemDialog />
          </div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Memuat budget...</p>
          ) : (
            <BudgetTable items={items} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Daftar Seserahan</h2>
              <p className="text-sm text-muted-foreground">Catat seserahan, harga, dan tempat belinya.</p>
            </div>
            <AddGiftDialog />
          </div>
          {giftsLoading ? (
            <p className="text-sm text-muted-foreground">Memuat seserahan...</p>
          ) : (
            <GiftTable gifts={gifts} />
          )}
        </CardContent>
      </Card>
    </div>
    </PageTransition>
  );
}
