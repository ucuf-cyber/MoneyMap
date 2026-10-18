import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const transaction = await prisma.transaction.update({
    where: { id: params.id },
    data: {
      ...(body.type !== undefined ? { type: body.type } : {}),
      ...(body.amount !== undefined ? { amount: Number(body.amount) } : {}),
      ...(body.date !== undefined ? { date: new Date(body.date) } : {}),
      ...(body.note !== undefined ? { note: body.note } : {}),
      ...(body.method !== undefined ? { method: body.method } : {}),
      ...(body.categoryId !== undefined ? { categoryId: body.categoryId } : {}),
    },
    include: { category: true },
  });
  return NextResponse.json(transaction);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.transaction.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
