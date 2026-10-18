import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const vendors = await prisma.weddingVendor.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(vendors);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const vendor = await prisma.weddingVendor.create({
    data: { name: body.name, contact: body.contact ?? null, notes: body.notes ?? null },
  });
  return NextResponse.json(vendor, { status: 201 });
}
