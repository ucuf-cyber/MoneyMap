import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const item = await prisma.weddingBudgetItem.update({
    where: { id: params.id },
    data: {
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.estimatedCost !== undefined ? { estimatedCost: Number(body.estimatedCost) } : {}),
      ...(body.actualCost !== undefined ? { actualCost: Number(body.actualCost) } : {}),
      ...(body.paidAmount !== undefined ? { paidAmount: Number(body.paidAmount) } : {}),
      ...(body.dueDate !== undefined ? { dueDate: body.dueDate ? new Date(body.dueDate) : null } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
      ...(body.vendorId !== undefined ? { vendorId: body.vendorId } : {}),
    },
    include: { vendor: true },
  });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.weddingBudgetItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
