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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICON_OPTIONS } from "@/lib/icon-map";
import { useUpdateCategory } from "@/hooks/use-data";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@/lib/types";

const PRESET_COLORS = ["#FF6B35", "#FFC93C", "#4ECDC4", "#A78BFA", "#F87171", "#34D399", "#38BDF8", "#94A3B8"];

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
}: {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = React.useState("");
  const [icon, setIcon] = React.useState(ICON_OPTIONS[0]);
  const [color, setColor] = React.useState(PRESET_COLORS[0]);
  const updateCategory = useUpdateCategory();
  const { toast } = useToast();

  React.useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setColor(category.color);
    }
  }, [category]);

  const handleSubmit = async () => {
    if (!category || !name.trim()) return;
    await updateCategory.mutateAsync({ id: category.id, data: { name: name.trim(), icon, color } });
    toast({ title: "Kategori diperbarui" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Kategori</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="edit-cat-name">Nama Kategori</Label>
            <Input id="edit-cat-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Warna</Label>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="h-6 w-6 rounded-full ring-offset-2 ring-offset-background transition-all"
                  style={{ backgroundColor: c, outline: color === c ? `2px solid ${c}` : "none" }}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={updateCategory.isPending}>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
