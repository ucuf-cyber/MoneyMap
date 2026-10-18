import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const body = await req.json();
  const currentPassword = String(body.currentPassword ?? "");
  const newPassword = String(body.newPassword ?? "");

  if (newPassword.length < 6) {
    return NextResponse.json({ error: "Password baru minimal 6 karakter" }, { status: 400 });
  }

  const user = await prisma.user.findFirst();
  if (!user?.passwordHash) {
    return NextResponse.json({ error: "Password belum diset" }, { status: 400 });
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Password saat ini salah" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}
