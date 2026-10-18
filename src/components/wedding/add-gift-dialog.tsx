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
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useCreateWeddingGift } from "@/hooks/use-data";

export function AddGiftDialog() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [storeLink, setStoreLink] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const createGift = useCreateWeddingGift();

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await createGift.mutateAsync({
      name: name.trim(),
      price: Number(price) || 0,
      storeLink: storeLink.trim() || null,
      notes: notes.trim() || null,
    });
    setName("");
    setPrice("");
    setStoreLink("");
    setNotes("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus className="h-4 w-4" /> Tambah Seserahan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Seserahan</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="gift-name">Nama Seserahan</Label>
            <Input id="gift-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Sepatu" />
          </div>
          <div>
            <Label htmlFor="gift-price">Harga (IDR)</Label>
            <Input
              id="gift-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="500000"
            />
          </div>
          <div>
            <Label htmlFor="gift-link">Link / Tempat Beli</Label>
            <Input
              id="gift-link"
              value={storeLink}
              onChange={(e) => setStoreLink(e.target.value)}
              placeholder="https://... atau nama toko"
            />
          </div>
          <div>
            <Label htmlFor="gift-notes">Catatan</Label>
            <Textarea id="gift-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opsional" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Tambah</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
