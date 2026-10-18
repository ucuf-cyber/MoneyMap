import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") ?? "xlsx";

  const transactions = await prisma.transaction.findMany({
    include: { category: true },
    orderBy: { date: "desc" },
  });

  const rows = transactions.map((t) => ({
    Tanggal: formatDate(t.date),
    Tipe: t.type === "income" ? "Pemasukan" : "Pengeluaran",
    Kategori: t.category?.name ?? "Lainnya",
    Jumlah: t.amount,
    Metode: t.method,
    Catatan: t.note ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [{ wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 30 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transaksi");

  if (format === "csv") {
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="moneymap-transaksi.csv"`,
      },
    });
  }

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="moneymap-transaksi.xlsx"`,
    },
  });
}
