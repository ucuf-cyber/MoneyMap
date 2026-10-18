import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }] });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const category = await prisma.category.create({
    data: {
      name: body.name,
      icon: body.icon ?? "Wallet",
      color: body.color ?? "#FF6B35",
      type: body.type ?? "expense",
    },
  });
  return NextResponse.json(category, { status: 201 });
}
