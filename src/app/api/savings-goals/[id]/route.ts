import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const goal = await prisma.savingsGoal.update({
    where: { id: params.id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.icon !== undefined ? { icon: body.icon } : {}),
      ...(body.color !== undefined ? { color: body.color } : {}),
      ...(body.targetAmount !== undefined ? { targetAmount: Number(body.targetAmount) } : {}),
      ...(body.currentAmount !== undefined ? { currentAmount: Number(body.currentAmount) } : {}),
      ...(body.autoSplitPct !== undefined ? { autoSplitPct: Number(body.autoSplitPct) } : {}),
      ...(body.targetDate !== undefined ? { targetDate: body.targetDate ? new Date(body.targetDate) : null } : {}),
      ...(body.isWeddingGoal !== undefined ? { isWeddingGoal: Boolean(body.isWeddingGoal) } : {}),
    },
  });
  return NextResponse.json(goal);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.savingsGoal.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
