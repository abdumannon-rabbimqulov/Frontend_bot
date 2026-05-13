"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { useEffect } from "react";
import { authApi } from "@/lib/api/endpoints";
import { useAuthStore } from "@/lib/store/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  const { accessToken, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;
    authApi
      .me()
      .then(setUser)
      .catch(() => logout());
  }, [accessToken, setUser, logout]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
