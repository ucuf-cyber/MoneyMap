"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR } from "@/lib/utils";
import type { MonthlyReport } from "@/lib/types";

export function TrendLineChart({ months }: { months: MonthlyReport[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren 12 Bulan Terakhir</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={months} margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs"
              tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`}
              width={40}
            />
            <Tooltip formatter={(value) => formatIDR(Number(value))} />
            <Legend />
            <Line type="monotone" dataKey="income" name="Pemasukan" stroke="#22C55E" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="expense" name="Pengeluaran" stroke="#FF6B35" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="savings" name="Tabungan" stroke="#FFC93C" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
