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
import { useCreateWeddingItem } from "@/hooks/use-data";

export function AddItemDialog() {
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState("");
  const createItem = useCreateWeddingItem();

  const handleSubmit = async () => {
    if (!category.trim()) return;
    await createItem.mutateAsync({ category: category.trim() });
    setCategory("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus className="h-4 w-4" /> Tambah Kategori
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Kategori Budget</DialogTitle>
        </DialogHeader>
        <div>
          <Label htmlFor="wed-category">Nama Kategori</Label>
          <Input
            id="wed-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Contoh: Sewa Mobil Pengantin"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Tambah</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
