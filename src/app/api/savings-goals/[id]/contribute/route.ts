import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const amount = Number(body.amount);

  if (!amount) {
    return NextResponse.json({ error: "amount wajib diisi" }, { status: 400 });
  }

  const [goal] = await prisma.$transaction([
    prisma.savingsGoal.update({
      where: { id: params.id },
      data: { currentAmount: { increment: amount } },
    }),
    prisma.savingsContribution.create({
      data: { goalId: params.id, amount, note: body.note ?? null },
    }),
  ]);

  return NextResponse.json(goal);
}
