import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const category = await prisma.category.update({
    where: { id: params.id },
    data: {
      name: body.name,
      icon: body.icon,
      color: body.color,
      type: body.type,
    },
  });
  return NextResponse.json(category);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
