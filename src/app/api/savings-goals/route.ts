import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const goals = await prisma.savingsGoal.findMany({
    orderBy: { createdAt: "asc" },
    include: { contributions: { orderBy: { date: "desc" }, take: 10 } },
  });
  return NextResponse.json(goals);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const goal = await prisma.savingsGoal.create({
    data: {
      name: body.name,
      icon: body.icon ?? "PiggyBank",
      color: body.color ?? "#FFC93C",
      targetAmount: Number(body.targetAmount),
      currentAmount: Number(body.currentAmount ?? 0),
      autoSplitPct: Number(body.autoSplitPct ?? 0),
      targetDate: body.targetDate ? new Date(body.targetDate) : null,
      isWeddingGoal: Boolean(body.isWeddingGoal),
    },
  });
  return NextResponse.json(goal, { status: 201 });
}
