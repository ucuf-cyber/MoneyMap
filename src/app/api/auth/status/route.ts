import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await prisma.user.findFirst();
  return NextResponse.json({ passwordSet: Boolean(user?.passwordHash) });
}
