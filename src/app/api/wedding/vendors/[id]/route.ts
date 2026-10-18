import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const vendor = await prisma.weddingVendor.update({
    where: { id: params.id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.contact !== undefined ? { contact: body.contact } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
    },
  });
  return NextResponse.json(vendor);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.weddingVendor.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
