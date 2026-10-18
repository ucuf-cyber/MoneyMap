"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export function InsightsCard({ insights }: { insights: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan & Notifikasi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-2xl border border-border p-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFC93C]">
              <Lightbulb className="h-3.5 w-3.5 text-black" />
            </div>
            <p className="text-sm">{insight}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
