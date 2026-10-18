"use client";

import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { formatIDR, cn } from "@/lib/utils";
import { useUpdateWeddingGift, useDeleteWeddingGift } from "@/hooks/use-data";
import type { WeddingGiftItem } from "@/lib/types";

function EditableText({
  value,
  onSave,
  className,
  placeholder,
}: {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const [local, setLocal] = React.useState(value);
  React.useEffect(() => setLocal(value), [value]);

  return (
    <Input
      value={local}
      placeholder={placeholder}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => {
        if (local !== value) onSave(local);
      }}
      className={cn("h-9", className)}
    />
  );
}

function EditablePrice({ value, onSave }: { value: number; onSave: (value: number) => void }) {
  const [local, setLocal] = React.useState(String(value));
  React.useEffect(() => setLocal(String(value)), [value]);

  return (
    <Input
      type="number"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => {
        const num = Number(local) || 0;
        if (num !== value) onSave(num);
      }}
      className="h-9 w-32 text-right"
    />
  );
}

export function GiftTable({ gifts }: { gifts: WeddingGiftItem[] }) {
  const updateGift = useUpdateWeddingGift();
  const deleteGift = useDeleteWeddingGift();

  const total = gifts.reduce((sum, g) => sum + g.price, 0);
  const totalPurchased = gifts.filter((g) => g.isPurchased).reduce((sum, g) => sum + g.price, 0);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10" />
          <TableHead>Nama Seserahan</TableHead>
          <TableHead className="text-right">Harga</TableHead>
          <TableHead>Link / Tempat Beli</TableHead>
          <TableHead>Catatan</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {gifts.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              Belum ada daftar seserahan.
            </TableCell>
          </TableRow>
        )}
        {gifts.map((gift) => (
          <TableRow key={gift.id} className={cn(gift.isPurchased && "bg-olive/10")}>
            <TableCell>
              <Checkbox
                checked={gift.isPurchased}
                onCheckedChange={(checked) =>
                  updateGift.mutate({ id: gift.id, data: { isPurchased: Boolean(checked) } })
                }
              />
            </TableCell>
            <TableCell>
              <EditableText
                value={gift.name}
                onSave={(v) => updateGift.mutate({ id: gift.id, data: { name: v } })}
                className={cn("w-44 font-medium", gift.isPurchased && "line-through text-muted-foreground")}
              />
            </TableCell>
            <TableCell>
              <EditablePrice value={gift.price} onSave={(v) => updateGift.mutate({ id: gift.id, data: { price: v } })} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <EditableText
                  value={gift.storeLink ?? ""}
                  placeholder="https://... atau nama toko"
                  onSave={(v) => updateGift.mutate({ id: gift.id, data: { storeLink: v || null } })}
                  className="w-52"
                />
                {gift.storeLink && /^https?:\/\//.test(gift.storeLink) && (
                  <a href={gift.storeLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground hover:text-foreground" />
                  </a>
                )}
              </div>
            </TableCell>
            <TableCell>
              <EditableText
                value={gift.notes ?? ""}
                placeholder="Opsional"
                onSave={(v) => updateGift.mutate({ id: gift.id, data: { notes: v || null } })}
                className="w-40"
              />
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-red-400"
                onClick={() => deleteGift.mutate(gift.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {gifts.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell />
            <TableCell className="font-bold">TOTAL</TableCell>
            <TableCell className="text-right font-bold">{formatIDR(total)}</TableCell>
            <TableCell colSpan={3} className="text-sm text-muted-foreground">
              Sudah dibeli: {formatIDR(totalPurchased)}
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
