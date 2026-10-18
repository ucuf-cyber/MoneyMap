"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { ToastContextProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 30, refetchOnWindowFocus: false },
    },
  }));

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ToastContextProvider>
            {children}
            <Toaster />
          </ToastContextProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
