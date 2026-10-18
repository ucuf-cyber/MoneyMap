"use client";

import * as React from "react";
import { RemindersWidget } from "@/components/dashboard/reminders-widget";
import { InsightsCard } from "@/components/dashboard/insights-card";
import { BigSummaryCard } from "@/components/dashboard/big-summary-card";
import { MonthlyTrendChart } from "@/components/dashboard/monthly-trend-chart";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { PageTransition } from "@/components/motion/page-transition";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { useReports, useSavingsGoals } from "@/hooks/use-data";

export default function DashboardPage() {
  const { data: reports } = useReports();
  const { data: goals = [] } = useSavingsGoals();

  const thisMonth = reports?.months[reports.months.length - 1];
  const totalIncome = thisMonth?.income ?? 0;
  const totalExpense = thisMonth?.expense ?? 0;
  const balance = totalIncome - totalExpense;

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const savingsProgressPct = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Halo, Kamu 👋</h1>
          <p className="text-sm text-muted-foreground">Ini ringkasan keuanganmu hari ini.</p>
        </div>

        <StaggerGrid className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <StaggerItem>
            <RemindersWidget />
          </StaggerItem>
          <StaggerItem>
            <InsightsCard insights={reports?.insights ?? ["Memuat insight..."]} />
          </StaggerItem>
          <StaggerItem>
            <BigSummaryCard
              balance={balance}
              totalExpense={totalExpense}
              totalIncome={totalIncome}
              savingsProgressPct={savingsProgressPct}
            />
          </StaggerItem>
          <StaggerItem>
            <MonthlyTrendChart months={reports?.months ?? []} />
          </StaggerItem>
        </StaggerGrid>

        <CategoryBreakdown categories={reports?.categoryBreakdown ?? []} />
      </div>
    </PageTransition>
  );
}
