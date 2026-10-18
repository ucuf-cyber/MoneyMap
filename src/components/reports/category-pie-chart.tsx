"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR } from "@/lib/utils";

export function CategoryPieChart({ categories }: { categories: { name: string; color: string; total: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Kategori Pengeluaran</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada data.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="total"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {categories.map((c) => (
                  <Cell key={c.name} fill={c.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatIDR(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
