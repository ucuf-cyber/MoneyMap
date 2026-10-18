import {
  UtensilsCrossed,
  Car,
  PartyPopper,
  ShoppingBag,
  Receipt,
  HeartPulse,
  MoreHorizontal,
  Banknote,
  Gift,
  PlusCircle,
  Wallet,
  PiggyBank,
  ShieldCheck,
  Plane,
  HeartHandshake,
  Home,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  PartyPopper,
  ShoppingBag,
  Receipt,
  HeartPulse,
  MoreHorizontal,
  Banknote,
  Gift,
  PlusCircle,
  Wallet,
  PiggyBank,
  ShieldCheck,
  Plane,
  HeartHandshake,
  Home,
  GraduationCap,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Wallet;
}

export const ICON_OPTIONS = Object.keys(ICON_MAP);
