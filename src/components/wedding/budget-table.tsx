"use client";

import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { formatIDR } from "@/lib/utils";
import { useUpdateWeddingItem, useDeleteWeddingItem, useWeddingVendors, useCreateWeddingVendor } from "@/hooks/use-data";
import type { WeddingBudgetItem } from "@/lib/types";

function EditableAmount({ value, onSave }: { value: number; onSave: (value: number) => void }) {
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

export function BudgetTable({ items }: { items: WeddingBudgetItem[] }) {
  const updateItem = useUpdateWeddingItem();
  const deleteItem = useDeleteWeddingItem();
  const { data: vendors = [] } = useWeddingVendors();
  const createVendor = useCreateWeddingVendor();

  const totals = items.reduce(
    (acc, i) => ({
      estimated: acc.estimated + i.estimatedCost,
      actual: acc.actual + i.actualCost,
      paid: acc.paid + i.paidAmount,
      remaining: acc.remaining + (i.actualCost - i.paidAmount),
    }),
    { estimated: 0, actual: 0, paid: 0, remaining: 0 }
  );

  const handleVendorChange = async (itemId: string, value: string) => {
    if (value === "__new__") {
      const name = window.prompt("Nama vendor baru:");
      if (!name) return;
      const vendor = await createVendor.mutateAsync({ name });
      updateItem.mutate({ id: itemId, data: { vendorId: vendor.id } });
    } else {
      updateItem.mutate({ id: itemId, data: { vendorId: value === "none" ? null : value } });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kategori</TableHead>
          <TableHead>Vendor</TableHead>
          <TableHead className="text-right">Estimasi</TableHead>
          <TableHead className="text-right">Aktual</TableHead>
          <TableHead className="text-right">Sudah Dibayar</TableHead>
          <TableHead className="text-right">Sisa</TableHead>
          <TableHead>Jatuh Tempo</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.category}</TableCell>
            <TableCell>
              <Select value={item.vendorId ?? "none"} onValueChange={(v) => handleVendorChange(item.id, v)}>
                <SelectTrigger className="h-9 w-40">
                  <SelectValue placeholder="Pilih vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-</SelectItem>
                  {vendors.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="__new__">+ Vendor baru...</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <EditableAmount
                value={item.estimatedCost}
                onSave={(v) => updateItem.mutate({ id: item.id, data: { estimatedCost: v } })}
              />
            </TableCell>
            <TableCell>
              <EditableAmount
                value={item.actualCost}
                onSave={(v) => updateItem.mutate({ id: item.id, data: { actualCost: v } })}
              />
            </TableCell>
            <TableCell>
              <EditableAmount
                value={item.paidAmount}
                onSave={(v) => updateItem.mutate({ id: item.id, data: { paidAmount: v } })}
              />
            </TableCell>
            <TableCell className="text-right font-semibold">
              {formatIDR(item.actualCost - item.paidAmount)}
            </TableCell>
            <TableCell>
              <Input
                type="date"
                defaultValue={item.dueDate ? item.dueDate.slice(0, 10) : ""}
                onBlur={(e) => updateItem.mutate({ id: item.id, data: { dueDate: e.target.value || null } })}
                className="h-9 w-36"
              />
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-red-400"
                onClick={() => deleteItem.mutate(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-bold">TOTAL</TableCell>
          <TableCell />
          <TableCell className="text-right font-bold">{formatIDR(totals.estimated)}</TableCell>
          <TableCell className="text-right font-bold">{formatIDR(totals.actual)}</TableCell>
          <TableCell className="text-right font-bold">{formatIDR(totals.paid)}</TableCell>
          <TableCell className="text-right font-bold">{formatIDR(totals.remaining)}</TableCell>
          <TableCell />
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
}
