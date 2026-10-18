"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionFormFields, type TransactionFormState } from "@/components/transactions/transaction-form-fields";
import { useUpdateTransaction } from "@/hooks/use-data";
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@/lib/types";

export function EditTransactionDialog({
  transaction,
  open,
  onOpenChange,
}: {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, setState] = React.useState<TransactionFormState | null>(null);
  const updateTransaction = useUpdateTransaction();
  const { toast } = useToast();

  React.useEffect(() => {
    if (transaction) {
      setState({
        type: transaction.type,
        amount: String(transaction.amount),
        date: transaction.date.slice(0, 10),
        categoryId: transaction.categoryId ?? "",
        method: transaction.method,
        note: transaction.note ?? "",
      });
    }
  }, [transaction]);

  const handleSubmit = async () => {
    if (!transaction || !state) return;
    if (!state.amount || Number(state.amount) <= 0) {
      toast({ title: "Jumlah tidak valid", variant: "destructive" });
      return;
    }
    await updateTransaction.mutateAsync({
      id: transaction.id,
      data: {
        type: state.type,
        amount: Number(state.amount),
        date: state.date,
        categoryId: state.categoryId || null,
        method: state.method as any,
        note: state.note || null,
      },
    });
    toast({ title: "Transaksi diperbarui" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaksi</DialogTitle>
        </DialogHeader>

        {state && <TransactionFormFields state={state} onChange={setState} />}

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={updateTransaction.isPending}>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
