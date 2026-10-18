"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useCreateSavingsGoal } from "@/hooks/use-data";
import { useToast } from "@/hooks/use-toast";

export function CreateGoalDialog() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [targetAmount, setTargetAmount] = React.useState("");
  const [autoSplitPct, setAutoSplitPct] = React.useState("0");
  const createGoal = useCreateSavingsGoal();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!name || !targetAmount || Number(targetAmount) <= 0) {
      toast({ title: "Lengkapi nama & target dulu ya", variant: "destructive" });
      return;
    }
    await createGoal.mutateAsync({
      name,
      targetAmount: Number(targetAmount),
      autoSplitPct: Number(autoSplitPct) || 0,
    });
    toast({ title: "Goal tabungan dibuat" });
    setName("");
    setTargetAmount("");
    setAutoSplitPct("0");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="h-4 w-4" /> Buat Goal Baru
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Goal Tabungan</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="goal-name">Nama Goal</Label>
            <Input id="goal-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dana Darurat" />
          </div>
          <div>
            <Label htmlFor="goal-target">Target (IDR)</Label>
            <Input
              id="goal-target"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="20000000"
            />
          </div>
          <div>
            <Label htmlFor="goal-split">Auto-split dari pemasukan (%)</Label>
            <Input
              id="goal-split"
              type="number"
              min={0}
              max={100}
              value={autoSplitPct}
              onChange={(e) => setAutoSplitPct(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Buat Goal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
