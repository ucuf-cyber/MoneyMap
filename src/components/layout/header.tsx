"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { Search, Moon, Sun, Bell, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <header className="flex items-center gap-4 border-b border-border px-4 py-4 md:px-8">
      <div className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Tanya apa saja soal keuanganmu..."
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Menu akun">
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarFallback>K</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-400 focus:text-red-400"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" /> Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
