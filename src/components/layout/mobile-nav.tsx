"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Receipt, PiggyBank, HeartHandshake, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/transactions", label: "Transaksi", icon: Receipt },
  { href: "/savings", label: "Tabungan", icon: PiggyBank },
  { href: "/wedding", label: "Wedding", icon: HeartHandshake },
  { href: "/reports", label: "Laporan", icon: BarChart3 },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-black/95 px-2 py-2 md:hidden">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] text-white/50",
              active && "text-[#FFC93C]"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
