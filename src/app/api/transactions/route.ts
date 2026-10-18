import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const categoryId = searchParams.get("categoryId");
  const type = searchParams.get("type");
  const q = searchParams.get("q");

  const transactions = await prisma.transaction.findMany({
    where: {
      ...(from || to
        ? { date: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } }
        : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(type ? { type } : {}),
      ...(q ? { note: { contains: q } } : {}),
    },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.amount || !body.type || !body.date) {
    return NextResponse.json({ error: "amount, type, dan date wajib diisi" }, { status: 400 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      type: body.type,
      amount: Number(body.amount),
      date: new Date(body.date),
      note: body.note ?? null,
      method: body.method ?? "cash",
      categoryId: body.categoryId ?? null,
    },
    include: { category: true },
  });

  if (body.type === "income") {
    const wedGoals = await prisma.savingsGoal.findMany({ where: { autoSplitPct: { gt: 0 } } });
    for (const goal of wedGoals) {
      const splitAmount = (Number(body.amount) * goal.autoSplitPct) / 100;
      if (splitAmount > 0) {
        await prisma.savingsGoal.update({
          where: { id: goal.id },
          data: { currentAmount: { increment: splitAmount } },
        });
        await prisma.savingsContribution.create({
          data: { goalId: goal.id, amount: splitAmount, note: "Auto-split dari pemasukan" },
        });
      }
    }
  }

  return NextResponse.json(transaction, { status: 201 });
}
