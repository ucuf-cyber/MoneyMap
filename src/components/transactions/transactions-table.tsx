"use client";

import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { formatIDR, formatDate } from "@/lib/utils";
import { getIcon } from "@/lib/icon-map";
import { useDeleteTransaction } from "@/hooks/use-data";
import { EditTransactionDialog } from "@/components/transactions/edit-transaction-dialog";
import type { Transaction } from "@/lib/types";

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  ewallet: "E-Wallet",
  transfer: "Transfer",
  card: "Kartu",
};

export function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const deleteTransaction = useDeleteTransaction();
  const [editing, setEditing] = React.useState<Transaction | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Catatan</TableHead>
            <TableHead>Metode</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Belum ada transaksi.
              </TableCell>
            </TableRow>
          )}
          {transactions.map((t) => {
            const Icon = getIcon(t.category?.icon ?? "Wallet");
            return (
              <TableRow key={t.id}>
                <TableCell className="whitespace-nowrap">{formatDate(t.date)}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${t.category?.color ?? "#94A3B8"}22` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: t.category?.color ?? "#94A3B8" }} />
                    </span>
                    {t.category?.name ?? "Lainnya"}
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">{t.note || "-"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{METHOD_LABELS[t.method] ?? t.method}</Badge>
                </TableCell>
                <TableCell className={`text-right font-semibold ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                  {t.type === "income" ? "+" : "-"}
                  {formatIDR(t.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setEditing(t)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-red-400"
                      onClick={() => deleteTransaction.mutate(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <EditTransactionDialog transaction={editing} open={!!editing} onOpenChange={(open) => !open && setEditing(null)} />
    </>
  );
}
