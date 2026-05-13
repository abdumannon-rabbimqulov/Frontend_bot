"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { authApi } from "@/lib/api/endpoints";
import { useAuthStore } from "@/lib/store/auth";
import { GlassCard, NeonButton } from "@/components/ui/kit";

export default function LoginPage() {
  const [phone_number, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setTokens } = useAuthStore();

  const routeByRole = (role?: string) => {
    if (role === "sender") router.replace("/sender/dashboard");
    else if (role === "driver") router.replace("/driver/dashboard");
    else if (role === "admin") router.replace("/admin/dashboard");
    else router.replace("/onboarding");
  };

  useEffect(() => {
    const initData = (window as any)?.Telegram?.WebApp?.initData;
    if (!initData) return;
    authApi
      .telegramLogin({ init_data: initData })
      .then((data) => {
        setTokens(data);
        routeByRole(data.role);
      })
      .catch(() => void 0);
  }, [setTokens]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await authApi.login({ phone_number, password });
      setTokens(data);
      routeByRole(data.role);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="mx-auto max-w-md p-4 pt-20">
      <GlassCard className="p-5">
        <h1 className="text-2xl font-bold">Logistika AI Login</h1>
        <p className="mt-1 text-sm text-slate-400">Telegram WebApp yoki telefon/parol orqali kiring</p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input value={phone_number} onChange={(e) => setPhone(e.target.value)} placeholder="+998..." className="w-full rounded-xl bg-white/10 p-3 text-sm" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full rounded-xl bg-white/10 p-3 text-sm"
          />
          {!!error && <p className="text-xs text-rose-400">{error}</p>}
          <NeonButton type="submit" className="w-full">
            Login
          </NeonButton>
        </form>
      </GlassCard>
    </div>
  );
}
