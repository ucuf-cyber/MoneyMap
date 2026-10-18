import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const password = String(body.password ?? "");

  if (password.length < 6) {
    return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
  }

  let user = await prisma.user.findFirst();
  if (user?.passwordHash) {
    return NextResponse.json({ error: "Password sudah pernah dibuat. Gunakan halaman login." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  if (user) {
    user = await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  } else {
    user = await prisma.user.create({ data: { name: "Kamu", passwordHash } });
  }

  return NextResponse.json({ ok: true });
}
