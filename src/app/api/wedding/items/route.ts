import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.weddingBudgetItem.findMany({
    include: { vendor: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await prisma.weddingBudgetItem.create({
    data: {
      category: body.category,
      estimatedCost: Number(body.estimatedCost ?? 0),
      actualCost: Number(body.actualCost ?? 0),
      paidAmount: Number(body.paidAmount ?? 0),
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      notes: body.notes ?? null,
      vendorId: body.vendorId ?? null,
    },
    include: { vendor: true },
  });
  return NextResponse.json(item, { status: 201 });
}
