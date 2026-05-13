"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthTokens, Role, User } from "@/lib/types";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  role: Role;
  user: User | null;
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      role: "guest",
      user: null,
      setTokens: (tokens) =>
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          role: (tokens.role as Role) || "guest",
        }),
      setUser: (user) => set({ user, role: (user?.role as Role) || "guest" }),
      logout: () => set({ accessToken: null, refreshToken: null, role: "guest", user: null }),
    }),
    { name: "logistika-auth-v1" },
  ),
);
