import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const gifts = await prisma.weddingGiftItem.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(gifts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const gift = await prisma.weddingGiftItem.create({
    data: {
      name: body.name,
      price: Number(body.price ?? 0),
      storeLink: body.storeLink ?? null,
      notes: body.notes ?? null,
    },
  });
  return NextResponse.json(gift, { status: 201 });
}
