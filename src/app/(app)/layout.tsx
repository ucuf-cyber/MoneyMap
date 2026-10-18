import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-16 md:pb-0">
        <Header />
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
