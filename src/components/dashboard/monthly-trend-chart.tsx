"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatIDR } from "@/lib/utils";
import type { MonthlyReport } from "@/lib/types";

export function MonthlyTrendChart({ months }: { months: MonthlyReport[] }) {
  const [mode, setMode] = React.useState<"realistis" | "optimis">("realistis");

  const data = React.useMemo(() => {
    if (mode === "realistis") return months;
    return months.map((m) => ({
      ...m,
      expense: Math.round(m.expense * 0.85),
      savings: Math.round(m.savings * 1.2 + m.income * 0.05),
    }));
  }, [mode, months]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Tren Bulanan</CardTitle>
        <Tabs value={mode} onValueChange={(v) => setMode(v as "realistis" | "optimis")}>
          <TabsList>
            <TabsTrigger value="realistis">Realistis</TabsTrigger>
            <TabsTrigger value="optimis">Optimis</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="h-80 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs"
              tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`}
              width={40}
            />
            <Tooltip
              formatter={(value) => formatIDR(Number(value))}
              contentStyle={{
                borderRadius: 16,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
              }}
            />
            <Legend />
            <Bar dataKey="income" name="Pemasukan" fill="#22C55E" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="Pengeluaran" fill="#FF6B35" radius={[6, 6, 0, 0]} />
            <Bar dataKey="savings" name="Tabungan" fill="#FFC93C" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
