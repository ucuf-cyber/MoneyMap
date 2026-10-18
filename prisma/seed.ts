import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: "Makan", icon: "UtensilsCrossed", color: "#FF6B35", type: "expense" },
  { name: "Transport", icon: "Car", color: "#4ECDC4", type: "expense" },
  { name: "Hiburan", icon: "PartyPopper", color: "#A78BFA", type: "expense" },
  { name: "Belanja", icon: "ShoppingBag", color: "#FFC93C", type: "expense" },
  { name: "Tagihan", icon: "Receipt", color: "#F87171", type: "expense" },
  { name: "Kesehatan", icon: "HeartPulse", color: "#34D399", type: "expense" },
  { name: "Lainnya", icon: "MoreHorizontal", color: "#94A3B8", type: "expense" },
  { name: "Gaji", icon: "Banknote", color: "#22C55E", type: "income" },
  { name: "Bonus", icon: "Gift", color: "#EAB308", type: "income" },
  { name: "Lainnya", icon: "PlusCircle", color: "#38BDF8", type: "income" },
];

const WEDDING_TEMPLATE = [
  "Venue",
  "Katering",
  "Dekorasi",
  "Fotografi/Videografi",
  "Baju & Riasan",
  "Undangan",
  "Souvenir",
  "MC & Hiburan",
  "Dokumen/Administrasi",
  "Dana Cadangan",
];

async function main() {
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    await prisma.user.create({ data: { name: "Kamu" } });
  }

  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { name_type: { name: cat.name, type: cat.type } },
      update: {},
      create: { ...cat, isDefault: true },
    });
  }

  const goalCount = await prisma.savingsGoal.count();
  if (goalCount === 0) {
    await prisma.savingsGoal.createMany({
      data: [
        { name: "Dana Darurat", icon: "ShieldCheck", color: "#4ECDC4", targetAmount: 20_000_000, currentAmount: 3_500_000 },
        { name: "Liburan", icon: "Plane", color: "#38BDF8", targetAmount: 10_000_000, currentAmount: 2_000_000 },
        { name: "Nikah", icon: "HeartHandshake", color: "#FF6B35", targetAmount: 150_000_000, currentAmount: 15_000_000, isWeddingGoal: true },
      ],
    });
  }

  const itemCount = await prisma.weddingBudgetItem.count();
  if (itemCount === 0) {
    await prisma.weddingBudgetItem.createMany({
      data: WEDDING_TEMPLATE.map((category) => ({ category, estimatedCost: 0, actualCost: 0, paidAmount: 0 })),
    });
  }

  const reminderCount = await prisma.reminder.count();
  if (reminderCount === 0) {
    await prisma.reminder.createMany({
      data: [
        { title: "Bayar listrik", amount: 250_000 },
        { title: "Cicilan e-wallet", amount: 500_000 },
        { title: "DP fotografer nikah", amount: 3_000_000 },
      ],
    });
  }

  console.log("Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
