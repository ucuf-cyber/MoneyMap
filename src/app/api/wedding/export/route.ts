import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.weddingBudgetItem.findMany({ include: { vendor: true }, orderBy: { createdAt: "asc" } });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "MoneyMap";
  const sheet = workbook.addWorksheet("Wedding Budget");

  sheet.columns = [
    { header: "Kategori", key: "category", width: 26 },
    { header: "Vendor", key: "vendor", width: 22 },
    { header: "Estimasi Budget", key: "estimatedCost", width: 18 },
    { header: "Budget Aktual", key: "actualCost", width: 18 },
    { header: "Sudah Dibayar (DP)", key: "paidAmount", width: 20 },
    { header: "Sisa Dibayar", key: "remaining", width: 16 },
    { header: "Jatuh Tempo", key: "dueDate", width: 16 },
    { header: "Catatan", key: "notes", width: 28 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FF1A1A1A" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFC93C" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = { bottom: { style: "thin" } };
  });

  let totalEstimated = 0;
  let totalActual = 0;
  let totalPaid = 0;

  for (const item of items) {
    const remaining = item.actualCost - item.paidAmount;
    totalEstimated += item.estimatedCost;
    totalActual += item.actualCost;
    totalPaid += item.paidAmount;

    sheet.addRow({
      category: item.category,
      vendor: item.vendor?.name ?? "-",
      estimatedCost: item.estimatedCost,
      actualCost: item.actualCost,
      paidAmount: item.paidAmount,
      remaining,
      dueDate: item.dueDate ? item.dueDate.toISOString().slice(0, 10) : "-",
      notes: item.notes ?? "",
    });
  }

  const totalRemaining = totalActual - totalPaid;
  const totalRow = sheet.addRow({
    category: "TOTAL",
    vendor: "",
    estimatedCost: totalEstimated,
    actualCost: totalActual,
    paidAmount: totalPaid,
    remaining: totalRemaining,
    dueDate: "",
    notes: "",
  });
  totalRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8E8E8" } };
    cell.border = { top: { style: "thin" } };
  });

  for (let r = 2; r <= totalRow.number; r++) {
    ["estimatedCost", "actualCost", "paidAmount", "remaining"].forEach((key) => {
      const col = sheet.getColumn(key);
      const cell = sheet.getCell(r, col.number as number);
      cell.numFmt = '#,##0 "IDR"';
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="wedding-budget-moneymap.xlsx"`,
    },
  });
}
