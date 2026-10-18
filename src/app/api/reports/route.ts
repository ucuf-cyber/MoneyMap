import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { monthKey, MONTH_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();
  const rangeStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const transactions = await prisma.transaction.findMany({
    where: { date: { gte: rangeStart } },
    include: { category: true },
    orderBy: { date: "asc" },
  });

  const contributions = await prisma.savingsContribution.findMany({
    where: { date: { gte: rangeStart } },
  });

  const months: { key: string; label: string; income: number; expense: number; savings: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: monthKey(d), label: MONTH_LABELS[d.getMonth()], income: 0, expense: 0, savings: 0 });
  }
  const monthIndex = new Map(months.map((m, idx) => [m.key, idx]));

  for (const t of transactions) {
    const idx = monthIndex.get(monthKey(t.date));
    if (idx === undefined) continue;
    if (t.type === "income") months[idx].income += t.amount;
    else months[idx].expense += t.amount;
  }
  for (const c of contributions) {
    const idx = monthIndex.get(monthKey(c.date));
    if (idx === undefined) continue;
    months[idx].savings += c.amount;
  }

  const categoryTotals = new Map<string, { name: string; color: string; total: number }>();
  const thisMonthKey = monthKey(now);
  const lastMonthKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const catThisMonth = new Map<string, number>();
  const catLastMonth = new Map<string, number>();

  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const name = t.category?.name ?? "Lainnya";
    const color = t.category?.color ?? "#94A3B8";
    const entry = categoryTotals.get(name) ?? { name, color, total: 0 };
    entry.total += t.amount;
    categoryTotals.set(name, entry);

    const mk = monthKey(t.date);
    if (mk === thisMonthKey) catThisMonth.set(name, (catThisMonth.get(name) ?? 0) + t.amount);
    if (mk === lastMonthKey) catLastMonth.set(name, (catLastMonth.get(name) ?? 0) + t.amount);
  }

  const insights: string[] = [];
  for (const [name, current] of catThisMonth.entries()) {
    const prev = catLastMonth.get(name) ?? 0;
    if (prev > 0) {
      const pct = ((current - prev) / prev) * 100;
      if (Math.abs(pct) >= 15) {
        insights.push(
          `Pengeluaran ${name} bulan ini ${pct > 0 ? "naik" : "turun"} ${Math.abs(pct).toFixed(0)}% dibanding bulan lalu.`
        );
      }
    } else if (current > 0) {
      insights.push(`Pengeluaran ${name} adalah kategori baru bulan ini, totalnya sudah ${Math.round(current).toLocaleString("id-ID")}.`);
    }
  }

  const totalIncomeThisMonth = months[months.length - 1].income;
  const totalExpenseThisMonth = months[months.length - 1].expense;
  if (totalIncomeThisMonth > 0) {
    const savingsRate = ((totalIncomeThisMonth - totalExpenseThisMonth) / totalIncomeThisMonth) * 100;
    insights.push(
      savingsRate >= 0
        ? `Kamu berhasil menyisihkan sekitar ${savingsRate.toFixed(0)}% dari pemasukan bulan ini.`
        : `Pengeluaran bulan ini melebihi pemasukan sebesar ${Math.abs(savingsRate).toFixed(0)}%.`
    );
  }
  if (insights.length === 0) insights.push("Belum ada cukup data untuk insight bulan ini. Terus catat transaksimu!");

  return NextResponse.json({
    months,
    categoryBreakdown: Array.from(categoryTotals.values()).sort((a, b) => b.total - a.total),
    insights,
  });
}
