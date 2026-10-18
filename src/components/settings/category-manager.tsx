"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Pencil } from "lucide-react";
import { getIcon, ICON_OPTIONS } from "@/lib/icon-map";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/use-data";
import { EditCategoryDialog } from "@/components/settings/edit-category-dialog";
import type { Category } from "@/lib/types";

const PRESET_COLORS = ["#FF6B35", "#FFC93C", "#4ECDC4", "#A78BFA", "#F87171", "#34D399", "#38BDF8", "#94A3B8"];

export function CategoryManager() {
  const { data: categories = [] } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [type, setType] = React.useState<"expense" | "income">("expense");
  const [name, setName] = React.useState("");
  const [icon, setIcon] = React.useState(ICON_OPTIONS[0]);
  const [color, setColor] = React.useState(PRESET_COLORS[0]);
  const [editing, setEditing] = React.useState<Category | null>(null);

  const filtered = categories.filter((c) => c.type === type);

  const handleAdd = async () => {
    if (!name.trim()) return;
    await createCategory.mutateAsync({ name: name.trim(), icon, color, type });
    setName("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategori</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={type} onValueChange={(v) => setType(v as "expense" | "income")}>
          <TabsList>
            <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
            <TabsTrigger value="income">Pemasukan</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          {filtered.map((c) => {
            const Icon = getIcon(c.icon);
            return (
              <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-border p-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${c.color}22` }}
                >
                  <Icon className="h-4 w-4" style={{ color: c.color }} />
                </span>
                <span className="flex-1 text-sm font-medium">{c.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setEditing(c)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-red-400"
                  onClick={() => deleteCategory.mutate(c.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-dashed border-border p-4 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <Label>Nama Kategori</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kategori baru" />
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
          <div className="sm:col-span-4">
            <Button onClick={handleAdd} className="w-full sm:w-auto">
              <Plus className="h-4 w-4" /> Tambah Kategori
            </Button>
          </div>
        </div>
      </CardContent>

      <EditCategoryDialog category={editing} open={!!editing} onOpenChange={(open) => !open && setEditing(null)} />
    </Card>
  );
}
