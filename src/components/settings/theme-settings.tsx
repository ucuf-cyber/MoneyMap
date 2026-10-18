"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tampilan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="dark-mode-switch">Mode Gelap</Label>
            <p className="text-sm text-muted-foreground">Dark mode aktif secara default.</p>
          </div>
          <Switch
            id="dark-mode-switch"
            checked={mounted && theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
