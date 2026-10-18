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
import { Plus } from "lucide-react";
import { TransactionFormFields, type TransactionFormState } from "@/components/transactions/transaction-form-fields";
import { useCreateTransaction } from "@/hooks/use-data";
import { useToast } from "@/hooks/use-toast";

const EMPTY_STATE: TransactionFormState = {
  type: "expense",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  categoryId: "",
  method: "cash",
  note: "",
};

export function QuickAddDialog() {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<TransactionFormState>(EMPTY_STATE);
  const createTransaction = useCreateTransaction();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!state.amount || Number(state.amount) <= 0) {
      toast({ title: "Jumlah tidak valid", variant: "destructive" });
      return;
    }
    await createTransaction.mutateAsync({
      type: state.type,
      amount: Number(state.amount),
      date: state.date,
      categoryId: state.categoryId || null,
      method: state.method as any,
      note: state.note || null,
    });
    toast({ title: "Transaksi ditambahkan" });
    setState({ ...EMPTY_STATE, date: new Date().toISOString().slice(0, 10) });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="h-4 w-4" /> Tambah Transaksi
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Transaksi</DialogTitle>
        </DialogHeader>

        <TransactionFormFields state={state} onChange={setState} />

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={createTransaction.isPending}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
