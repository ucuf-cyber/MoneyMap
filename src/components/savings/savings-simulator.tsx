"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatIDR } from "@/lib/utils";
import type { SavingsGoal } from "@/lib/types";
import { Calculator } from "lucide-react";

export function SavingsSimulator({ goals }: { goals: SavingsGoal[] }) {
  const [goalId, setGoalId] = React.useState(goals[0]?.id ?? "");
  const [monthly, setMonthly] = React.useState("500000");

  const goal = goals.find((g) => g.id === goalId) ?? goals[0];

  const result = React.useMemo(() => {
    if (!goal || !monthly || Number(monthly) <= 0) return null;
    const remaining = goal.targetAmount - goal.currentAmount;
    if (remaining <= 0) return { monthsLeft: 0, targetDate: new Date() };
    const monthsLeft = Math.ceil(remaining / Number(monthly));
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + monthsLeft);
    return { monthsLeft, targetDate };
  }, [goal, monthly]);

  if (goals.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-[#FFC93C]" /> Simulasi Nabung
        </CardTitle>
        <CardDescription>Kalau nabung segini per bulan, goal-mu tercapai kapan?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>Goal</Label>
            <Select value={goalId || goals[0]?.id} onValueChange={setGoalId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {goals.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Nabung per bulan (IDR)</Label>
            <Input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
          </div>
        </div>

        {result && goal && (
          <div className="rounded-2xl bg-gradient-to-r from-[#FF6B35]/10 to-[#FFC93C]/10 p-4">
            {result.monthsLeft === 0 ? (
              <p className="text-sm font-medium">Goal &quot;{goal.name}&quot; sudah tercapai! 🎉</p>
            ) : (
              <p className="text-sm">
                Dengan nabung <strong>{formatIDR(Number(monthly))}</strong>/bulan, goal{" "}
                <strong>{goal.name}</strong> tercapai dalam{" "}
                <strong>{result.monthsLeft} bulan</strong> (sekitar{" "}
                <strong>{result.targetDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</strong>).
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
