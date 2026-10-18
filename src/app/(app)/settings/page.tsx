import { CategoryManager } from "@/components/settings/category-manager";
import { ThemeSettings } from "@/components/settings/theme-settings";
import { DataBackup } from "@/components/settings/data-backup";
import { ChangePassword } from "@/components/settings/change-password";
import { PageTransition } from "@/components/motion/page-transition";

export default function SettingsPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
          <p className="text-sm text-muted-foreground">Kelola kategori, tema, dan data aplikasimu.</p>
        </div>

        <ThemeSettings />
        <ChangePassword />
        <CategoryManager />
        <DataBackup />
      </div>
    </PageTransition>
  );
}
