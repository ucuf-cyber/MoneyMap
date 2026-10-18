"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Receipt,
  PiggyBank,
  HeartHandshake,
  BarChart3,
  Settings,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/transactions", label: "Transaksi", icon: Receipt },
  { href: "/savings", label: "Tabungan", icon: PiggyBank },
  { href: "/wedding", label: "Wedding Budget", icon: HeartHandshake },
  { href: "/reports", label: "Laporan", icon: BarChart3 },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-20 lg:w-64 shrink-0 flex-col gap-2 border-r border-border bg-black/95 dark:bg-black/95 px-3 py-6 text-white">
      <div className="flex items-center gap-2 px-2 pb-6 lg:px-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFC93C]">
          <Wallet className="h-5 w-5 text-black" />
        </div>
        <span className="hidden text-lg font-bold tracking-tight lg:inline">MoneyMap</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white",
                active && "bg-gradient-to-r from-[#FF6B35]/20 to-[#FFC93C]/10 text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  active ? "text-[#FFC93C]" : "text-white/50 group-hover:text-white"
                )}
              />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden rounded-2xl bg-white/5 p-4 lg:block">
        <p className="text-xs text-white/50">Aman & Privat</p>
        <p className="mt-1 text-sm font-medium">Data kamu dilindungi password, cuma kamu yang bisa akses.</p>
      </div>
    </aside>
  );
}
