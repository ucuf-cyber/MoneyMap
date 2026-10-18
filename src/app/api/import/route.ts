import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });

  const text = await file.text();
  const backup = JSON.parse(text);
  const data = backup.data;

  if (!data) return NextResponse.json({ error: "Format backup tidak valid" }, { status: 400 });

  await prisma.$transaction([
    prisma.savingsContribution.deleteMany(),
    prisma.transaction.deleteMany(),
    prisma.weddingBudgetItem.deleteMany(),
    prisma.weddingVendor.deleteMany(),
    prisma.savingsGoal.deleteMany(),
    prisma.category.deleteMany(),
    prisma.reminder.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const dateFields = ["createdAt", "updatedAt", "date", "dueDate", "targetDate"];
  const reviveDates = (obj: Record<string, unknown>) => {
    const copy: Record<string, unknown> = { ...obj };
    for (const key of dateFields) {
      if (copy[key]) copy[key] = new Date(copy[key] as string);
    }
    return copy;
  };
  const revive = (arr: unknown[]) => (arr ?? []).map((item) => reviveDates(item as Record<string, unknown>));

  await prisma.user.createMany({ data: revive(data.users) as any });
  await prisma.category.createMany({ data: revive(data.categories) as any });
  await prisma.weddingVendor.createMany({ data: revive(data.weddingVendors) as any });
  await prisma.savingsGoal.createMany({ data: revive(data.savingsGoals) as any });
  await prisma.reminder.createMany({ data: revive(data.reminders) as any });
  await prisma.transaction.createMany({ data: revive(data.transactions) as any });
  await prisma.weddingBudgetItem.createMany({ data: revive(data.weddingBudgetItems) as any });
  await prisma.savingsContribution.createMany({ data: revive(data.savingsContributions) as any });

  return NextResponse.json({ ok: true });
}
