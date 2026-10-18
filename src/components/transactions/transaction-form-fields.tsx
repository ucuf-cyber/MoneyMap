"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategories } from "@/hooks/use-data";

export const METHODS = [
  { value: "cash", label: "Cash" },
  { value: "ewallet", label: "E-Wallet" },
  { value: "transfer", label: "Transfer" },
  { value: "card", label: "Kartu" },
];

export type TransactionFormState = {
  type: "expense" | "income";
  amount: string;
  date: string;
  categoryId: string;
  method: string;
  note: string;
};

export function TransactionFormFields({
  state,
  onChange,
}: {
  state: TransactionFormState;
  onChange: (state: TransactionFormState) => void;
}) {
  const { data: categories = [] } = useCategories();
  const filteredCategories = categories.filter((c) => c.type === state.type);

  return (
    <>
      <Tabs
        value={state.type}
        onValueChange={(v) => onChange({ ...state, type: v as "expense" | "income", categoryId: "" })}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expense">Pengeluaran</TabsTrigger>
          <TabsTrigger value="income">Pemasukan</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-3">
        <div>
          <Label htmlFor="amount">Jumlah (IDR)</Label>
          <Input
            id="amount"
            type="number"
            value={state.amount}
            onChange={(e) => onChange({ ...state, amount: e.target.value })}
            placeholder="50000"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              value={state.date}
              onChange={(e) => onChange({ ...state, date: e.target.value })}
            />
          </div>
          <div>
            <Label>Metode</Label>
            <Select value={state.method} onValueChange={(v) => onChange({ ...state, method: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Kategori</Label>
          <Select value={state.categoryId} onValueChange={(v) => onChange({ ...state, categoryId: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="note">Catatan</Label>
          <Textarea
            id="note"
            value={state.note}
            onChange={(e) => onChange({ ...state, note: e.target.value })}
            placeholder="Opsional"
          />
        </div>
      </div>
    </>
  );
}
