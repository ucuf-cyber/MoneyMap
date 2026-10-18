"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

export function StaggerGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={cn(className)} variants={container} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={cn(className)} variants={item}>
      {children}
    </motion.div>
  );
}
