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
import { useUpdateReminder } from "@/hooks/use-data";
import { useToast } from "@/hooks/use-toast";
import type { Reminder } from "@/lib/types";

export function EditReminderDialog({
  reminder,
  open,
  onOpenChange,
}: {
  reminder: Reminder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const updateReminder = useUpdateReminder();
  const { toast } = useToast();

  React.useEffect(() => {
    if (reminder) {
      setTitle(reminder.title);
      setAmount(reminder.amount ? String(reminder.amount) : "");
      setDueDate(reminder.dueDate ? reminder.dueDate.slice(0, 10) : "");
    }
  }, [reminder]);

  const handleSubmit = async () => {
    if (!reminder || !title.trim()) return;
    await updateReminder.mutateAsync({
      id: reminder.id,
      data: {
        title: title.trim(),
        amount: amount ? Number(amount) : null,
        dueDate: dueDate || null,
      },
    });
    toast({ title: "Reminder diperbarui" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Reminder</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="edit-reminder-title">Judul</Label>
            <Input id="edit-reminder-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="edit-reminder-amount">Jumlah (IDR)</Label>
              <Input
                id="edit-reminder-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Opsional"
              />
            </div>
            <div>
              <Label htmlFor="edit-reminder-due">Jatuh Tempo</Label>
              <Input
                id="edit-reminder-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={updateReminder.isPending}>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
