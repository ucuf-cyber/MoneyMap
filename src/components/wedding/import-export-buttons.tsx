"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function ImportExportButtons() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [importing, setImporting] = React.useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const handleExport = () => {
    window.location.href = "/api/wedding/export";
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/wedding/import", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal import");
      toast({ title: `Berhasil import ${json.imported} kategori budget` });
      qc.invalidateQueries({ queryKey: ["weddingItems"] });
      qc.invalidateQueries({ queryKey: ["weddingVendors"] });
    } catch (err) {
      toast({ title: "Import gagal", description: (err as Error).message, variant: "destructive" });
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button variant="outline" onClick={handleImportClick} disabled={importing}>
        <Upload className="h-4 w-4" /> {importing ? "Mengimpor..." : "Import Excel"}
      </Button>
      <Button onClick={handleExport}>
        <Download className="h-4 w-4" /> Export ke Excel
      </Button>
    </div>
  );
}
