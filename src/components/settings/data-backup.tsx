"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DataBackup() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [importing, setImporting] = React.useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    window.location.href = "/api/export";
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!window.confirm("Import akan mengganti SEMUA data yang ada saat ini. Lanjutkan?")) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/import", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Gagal import data");
      toast({ title: "Data berhasil dipulihkan. Memuat ulang..." });
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      toast({ title: "Import gagal", description: (err as Error).message, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Restore Data</CardTitle>
        <CardDescription>Backup rutin disarankan meskipun data tersimpan di database cloud.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export Semua Data (.json)
        </Button>
        <Button variant="destructive" onClick={handleImportClick} disabled={importing}>
          <Upload className="h-4 w-4" /> {importing ? "Mengimpor..." : "Import & Restore Data"}
        </Button>
      </CardContent>
    </Card>
  );
}
