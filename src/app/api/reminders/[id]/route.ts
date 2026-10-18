import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const reminder = await prisma.reminder.update({
    where: { id: params.id },
    data: {
      ...(body.isDone !== undefined ? { isDone: Boolean(body.isDone) } : {}),
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.amount !== undefined ? { amount: body.amount ? Number(body.amount) : null } : {}),
      ...(body.dueDate !== undefined ? { dueDate: body.dueDate ? new Date(body.dueDate) : null } : {}),
    },
  });
  return NextResponse.json(reminder);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.reminder.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
