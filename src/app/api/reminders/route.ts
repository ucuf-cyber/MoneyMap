import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reminders = await prisma.reminder.findMany({ orderBy: [{ isDone: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(reminders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const reminder = await prisma.reminder.create({
    data: {
      title: body.title,
      amount: body.amount ? Number(body.amount) : null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
  });
  return NextResponse.json(reminder, { status: 201 });
}
