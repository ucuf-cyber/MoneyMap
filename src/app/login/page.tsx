"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Wallet, Lock, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [checking, setChecking] = React.useState(true);
  const [passwordSet, setPasswordSet] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) => setPasswordSet(Boolean(data.passwordSet)))
      .finally(() => setChecking(false));
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal membuat password");

      const result = await signIn("credentials", { password, redirect: false });
      if (result?.error) throw new Error("Password dibuat, tapi gagal login otomatis. Coba login manual.");
      window.location.href = callbackUrl;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", { password, redirect: false });
      if (result?.error) throw new Error("Password salah");
      window.location.href = callbackUrl;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FFC93C]">
            <Wallet className="h-6 w-6 text-black" />
          </div>
          <CardTitle className="mt-2 text-xl">MoneyMap</CardTitle>
          <CardDescription>
            {checking
              ? "Memuat..."
              : passwordSet
                ? "Masukkan password untuk masuk"
                : "Buat password untuk mengamankan data keuanganmu"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!checking && (
            <form onSubmit={passwordSet ? handleLogin : handleSetup} className="space-y-3">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {!passwordSet && (
                <div>
                  <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Memproses..." : passwordSet ? "Masuk" : "Buat Password & Masuk"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
