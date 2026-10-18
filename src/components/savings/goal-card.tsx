"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Pencil } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import { formatIDR } from "@/lib/utils";
import { useContributeSavingsGoal, useDeleteSavingsGoal } from "@/hooks/use-data";
import { useToast } from "@/hooks/use-toast";
import { EditGoalDialog } from "@/components/savings/edit-goal-dialog";
import type { SavingsGoal } from "@/lib/types";

function estimateCompletion(goal: SavingsGoal): string {
  if (goal.currentAmount >= goal.targetAmount) return "Tercapai! 🎉";
  if (goal.contributions.length < 2) return "Butuh lebih banyak data";

  const sorted = [...goal.contributions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const first = new Date(sorted[0].date);
  const last = new Date(sorted[sorted.length - 1].date);
  const monthsSpan = Math.max(1, (last.getFullYear() - first.getFullYear()) * 12 + (last.getMonth() - first.getMonth()) + 1);
  const totalContributed = sorted.reduce((sum, c) => sum + c.amount, 0);
  const avgPerMonth = totalContributed / monthsSpan;

  if (avgPerMonth <= 0) return "Belum ada rata-rata menabung";

  const remaining = goal.targetAmount - goal.currentAmount;
  const monthsLeft = Math.ceil(remaining / avgPerMonth);
  const target = new Date();
  target.setMonth(target.getMonth() + monthsLeft);
  return `~${monthsLeft} bulan lagi (sekitar ${target.toLocaleDateString("id-ID", { month: "long", year: "numeric" })})`;
}

export function GoalCard({ goal }: { goal: SavingsGoal }) {
  const Icon = getIcon(goal.icon);
  const pct = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const [amount, setAmount] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const contribute = useContributeSavingsGoal();
  const remove = useDeleteSavingsGoal();
  const { toast } = useToast();

  const handleContribute = async () => {
    if (!amount || Number(amount) <= 0) return;
    await contribute.mutateAsync({ id: goal.id, amount: Number(amount) });
    toast({ title: `Berhasil menabung ke ${goal.name}` });
    setAmount("");
    setOpen(false);
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: "easeOut" }}>
    <Card className="overflow-hidden transition-shadow hover:shadow-lg hover:shadow-black/10">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${goal.color}22` }}
            >
              <Icon className="h-5 w-5" style={{ color: goal.color }} />
            </span>
            <div>
              <p className="font-semibold">{goal.name}</p>
              <p className="text-xs text-muted-foreground">{estimateCompletion(goal)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-400" onClick={() => remove.mutate(goal.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold">{formatIDR(goal.currentAmount)}</span>
            <span className="text-sm text-muted-foreground">dari {formatIDR(goal.targetAmount)}</span>
          </div>
          <Progress value={Math.min(pct, 100)} className="mt-2" />
          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>{pct.toFixed(0)}% tercapai</span>
            {goal.autoSplitPct > 0 && <span>Auto-split {goal.autoSplitPct}% dari pemasukan</span>}
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full" variant="secondary">
              <Plus className="h-4 w-4" /> Nabung Sekarang
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nabung ke {goal.name}</DialogTitle>
            </DialogHeader>
            <Input
              type="number"
              placeholder="Jumlah (IDR)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={handleContribute}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <EditGoalDialog goal={goal} open={editOpen} onOpenChange={setEditOpen} />
      </CardContent>
    </Card>
    </motion.div>
  );
}
