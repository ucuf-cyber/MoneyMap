import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [users, categories, transactions, savingsGoals, savingsContributions, weddingVendors, weddingBudgetItems, reminders] =
    await Promise.all([
      prisma.user.findMany(),
      prisma.category.findMany(),
      prisma.transaction.findMany(),
      prisma.savingsGoal.findMany(),
      prisma.savingsContribution.findMany(),
      prisma.weddingVendor.findMany(),
      prisma.weddingBudgetItem.findMany(),
      prisma.reminder.findMany(),
    ]);

  const backup = {
    exportedAt: new Date().toISOString(),
    version: 1,
    data: {
      users,
      categories,
      transactions,
      savingsGoals,
      savingsContributions,
      weddingVendors,
      weddingBudgetItems,
      reminders,
    },
  };

  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="moneymap-backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
