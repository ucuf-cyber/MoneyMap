import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

  let imported = 0;

  for (const row of rows) {
    const category = String(row["Kategori"] ?? "").trim();
    if (!category || category.toUpperCase() === "TOTAL") continue;

    const vendorName = row["Vendor"] ? String(row["Vendor"]).trim() : null;
    let vendorId: string | null = null;
    if (vendorName && vendorName !== "-") {
      const existingVendor = await prisma.weddingVendor.findFirst({ where: { name: vendorName } });
      const vendor = existingVendor ?? (await prisma.weddingVendor.create({ data: { name: vendorName } }));
      vendorId = vendor.id;
    }

    const estimatedCost = Number(row["Estimasi Budget"] ?? 0) || 0;
    const actualCost = Number(row["Budget Aktual"] ?? 0) || 0;
    const paidAmount = Number(row["Sudah Dibayar (DP)"] ?? 0) || 0;
    const dueRaw = row["Jatuh Tempo"];
    const dueDate = dueRaw && dueRaw !== "-" ? new Date(dueRaw as string) : null;
    const notes = row["Catatan"] ? String(row["Catatan"]) : null;

    await prisma.weddingBudgetItem.create({
      data: {
        category,
        estimatedCost,
        actualCost,
        paidAmount,
        dueDate: dueDate && !isNaN(dueDate.getTime()) ? dueDate : null,
        notes,
        vendorId,
      },
    });
    imported++;
  }

  return NextResponse.json({ imported });
}
