"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, formatIDR, MONTH_LABELS } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function CalendarHeatmap({ transactions }: { transactions: Transaction[] }) {
  const [cursor, setCursor] = React.useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const dailyExpense = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      const d = new Date(t.date);
      if (d.getFullYear() !== cursor.getFullYear() || d.getMonth() !== cursor.getMonth()) continue;
      const key = d.getDate();
      map.set(String(key), (map.get(String(key)) ?? 0) + t.amount);
    }
    return map;
  }, [transactions, cursor]);

  const maxAmount = Math.max(1, ...Array.from(dailyExpense.values()));
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const intensity = (amount: number) => {
    const ratio = amount / maxAmount;
    if (amount === 0) return "bg-muted";
    if (ratio < 0.25) return "bg-[#FFC93C]/25";
    if (ratio < 0.5) return "bg-[#FFC93C]/50";
    if (ratio < 0.75) return "bg-[#FF6B35]/70";
    return "bg-[#FF6B35]";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>
          Kalender Pengeluaran — {MONTH_LABELS[cursor.getMonth()]} {cursor.getFullYear()}
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-muted-foreground">
          {WEEKDAYS.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>
        <div className="mt-1.5 grid grid-cols-7 gap-1.5">
          {cells.map((day, idx) => {
            if (day === null) return <div key={idx} />;
            const amount = dailyExpense.get(String(day)) ?? 0;
            return (
              <div
                key={idx}
                title={amount > 0 ? formatIDR(amount) : undefined}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg text-xs font-medium transition-colors",
                  intensity(amount),
                  amount > maxAmount * 0.5 ? "text-black" : "text-foreground"
                )}
              >
                {day}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
