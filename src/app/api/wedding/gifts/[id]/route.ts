import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const gift = await prisma.weddingGiftItem.update({
    where: { id: params.id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.price !== undefined ? { price: Number(body.price) } : {}),
      ...(body.storeLink !== undefined ? { storeLink: body.storeLink } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
      ...(body.isPurchased !== undefined ? { isPurchased: Boolean(body.isPurchased) } : {}),
    },
  });
  return NextResponse.json(gift);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.weddingGiftItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
