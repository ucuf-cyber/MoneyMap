"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatIDR, cn } from "@/lib/utils";
import { useReminders, useCreateReminder, useUpdateReminder, useDeleteReminder } from "@/hooks/use-data";
import { EditReminderDialog } from "@/components/dashboard/edit-reminder-dialog";
import type { Reminder } from "@/lib/types";

export function RemindersWidget() {
  const { data: reminders = [] } = useReminders();
  const createReminder = useCreateReminder();
  const updateReminder = useUpdateReminder();
  const deleteReminder = useDeleteReminder();
  const [title, setTitle] = React.useState("");
  const [editing, setEditing] = React.useState<Reminder | null>(null);

  const handleAdd = () => {
    if (!title.trim()) return;
    createReminder.mutate({ title: title.trim() });
    setTitle("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cek Cepat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {reminders.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada tagihan. Tambahkan di bawah.</p>
        )}
        {reminders.map((r) => (
          <div
            key={r.id}
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-border p-3 transition-colors",
              r.isDone && "bg-olive/20 border-transparent"
            )}
          >
            <Checkbox
              checked={r.isDone}
              onCheckedChange={(checked) => updateReminder.mutate({ id: r.id, data: { isDone: Boolean(checked) } })}
            />
            <div className="flex-1">
              <p className={cn("text-sm font-medium", r.isDone && "line-through text-muted-foreground")}>
                {r.title}
              </p>
              {r.amount ? <p className="text-xs text-muted-foreground">{formatIDR(r.amount)}</p> : null}
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setEditing(r)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-red-400"
                onClick={() => deleteReminder.mutate(r.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex gap-2 pt-2">
          <Input
            placeholder="Tambah reminder..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button size="icon" onClick={handleAdd} aria-label="Tambah">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      <EditReminderDialog reminder={editing} open={!!editing} onOpenChange={(open) => !open && setEditing(null)} />
    </Card>
  );
}
