"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Download } from "lucide-react";
import { TrendLineChart } from "@/components/reports/trend-line-chart";
import { CategoryPieChart } from "@/components/reports/category-pie-chart";
import { PageTransition } from "@/components/motion/page-transition";
import { useReports } from "@/hooks/use-data";

export default function ReportsPage() {
  const { data: reports } = useReports();

  return (
    <PageTransition>
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan & Insight</h1>
          <p className="text-sm text-muted-foreground">Pantau tren keuanganmu bulanan & tahunan.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/api/reports/export?format=csv">
              <Download className="h-4 w-4" /> Export CSV
            </a>
          </Button>
          <Button asChild>
            <a href="/api/reports/export?format=xlsx">
              <Download className="h-4 w-4" /> Export Excel
            </a>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[#FFC93C]" /> Insight Otomatis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(reports?.insights ?? []).map((insight, idx) => (
            <p key={idx} className="rounded-2xl border border-border p-3 text-sm">
              {insight}
            </p>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TrendLineChart months={reports?.months ?? []} />
        <CategoryPieChart categories={reports?.categoryBreakdown ?? []} />
      </div>
    </div>
    </PageTransition>
  );
}
