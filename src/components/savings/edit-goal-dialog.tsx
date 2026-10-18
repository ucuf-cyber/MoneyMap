"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateSavingsGoal } from "@/hooks/use-data";
import { useToast } from "@/hooks/use-toast";
import type { SavingsGoal } from "@/lib/types";

export function EditGoalDialog({
  goal,
  open,
  onOpenChange,
}: {
  goal: SavingsGoal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = React.useState("");
  const [targetAmount, setTargetAmount] = React.useState("");
  const [currentAmount, setCurrentAmount] = React.useState("");
  const [autoSplitPct, setAutoSplitPct] = React.useState("0");
  const updateGoal = useUpdateSavingsGoal();
  const { toast } = useToast();

  React.useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTargetAmount(String(goal.targetAmount));
      setCurrentAmount(String(goal.currentAmount));
      setAutoSplitPct(String(goal.autoSplitPct));
    }
  }, [goal]);

  const handleSubmit = async () => {
    if (!goal || !name.trim() || !targetAmount || Number(targetAmount) <= 0) {
      toast({ title: "Lengkapi nama & target dulu ya", variant: "destructive" });
      return;
    }
    await updateGoal.mutateAsync({
      id: goal.id,
      data: {
        name: name.trim(),
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount) || 0,
        autoSplitPct: Number(autoSplitPct) || 0,
      },
    });
    toast({ title: "Goal diperbarui" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Goal Tabungan</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="edit-goal-name">Nama Goal</Label>
            <Input id="edit-goal-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="edit-goal-current">Sudah Terkumpul (IDR)</Label>
              <Input
                id="edit-goal-current"
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-goal-target">Target (IDR)</Label>
              <Input
                id="edit-goal-target"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-goal-split">Auto-split dari pemasukan (%)</Label>
            <Input
              id="edit-goal-split"
              type="number"
              min={0}
              max={100}
              value={autoSplitPct}
              onChange={(e) => setAutoSplitPct(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={updateGoal.isPending}>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
