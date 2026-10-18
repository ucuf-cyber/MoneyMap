"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-data";

export type TransactionFilters = {
  q: string;
  type: string;
  categoryId: string;
  from: string;
  to: string;
};

export function TransactionsFiltersBar({
  filters,
  onChange,
}: {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}) {
  const { data: categories = [] } = useCategories();

  return (
    <div className="flex flex-wrap gap-3">
      <Input
        placeholder="Cari catatan..."
        value={filters.q}
        onChange={(e) => onChange({ ...filters, q: e.target.value })}
        className="max-w-xs"
      />

      <Select value={filters.type || "all"} onValueChange={(v) => onChange({ ...filters, type: v === "all" ? "" : v })}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Semua tipe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua tipe</SelectItem>
          <SelectItem value="expense">Pengeluaran</SelectItem>
          <SelectItem value="income">Pemasukan</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.categoryId || "all"}
        onValueChange={(v) => onChange({ ...filters, categoryId: v === "all" ? "" : v })}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Semua kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua kategori</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input type="date" value={filters.from} onChange={(e) => onChange({ ...filters, from: e.target.value })} className="w-40" />
      <Input type="date" value={filters.to} onChange={(e) => onChange({ ...filters, to: e.target.value })} className="w-40" />
    </div>
  );
}
