"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QuickAddDialog } from "@/components/transactions/quick-add-dialog";
import { TransactionsFiltersBar, type TransactionFilters } from "@/components/transactions/transactions-filters";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { CalendarHeatmap } from "@/components/transactions/calendar-heatmap";
import { PageTransition } from "@/components/motion/page-transition";
import { useTransactions } from "@/hooks/use-data";

export default function TransactionsPage() {
  const [filters, setFilters] = React.useState<TransactionFilters>({
    q: "",
    type: "",
    categoryId: "",
    from: "",
    to: "",
  });

  const params: Record<string, string> = {};
  if (filters.q) params.q = filters.q;
  if (filters.type) params.type = filters.type;
  if (filters.categoryId) params.categoryId = filters.categoryId;
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;

  const { data: transactions = [], isLoading } = useTransactions(params);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Transaksi</h1>
            <p className="text-sm text-muted-foreground">Catat pemasukan & pengeluaran harianmu.</p>
          </div>
          <QuickAddDialog />
        </div>

        <CalendarHeatmap transactions={transactions} />

        <Card>
          <CardContent className="space-y-4 p-6">
            <TransactionsFiltersBar filters={filters} onChange={setFilters} />
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Memuat transaksi...</p>
            ) : (
              <TransactionsTable transactions={transactions} />
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
