"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR } from "@/lib/utils";

export function CategoryBreakdown({
  categories,
}: {
  categories: { name: string; color: string; total: number }[];
}) {
  const total = categories.reduce((sum, c) => sum + c.total, 0);
  const top = categories.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Breakdown Pengeluaran</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {top.length === 0 && <p className="text-sm text-muted-foreground">Belum ada data pengeluaran.</p>}
        {top.map((c) => {
          const pct = total > 0 ? (c.total / total) * 100 : 0;
          return (
            <div key={c.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="text-muted-foreground">{formatIDR(c.total)}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: c.color }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
