"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import type { Role } from "@/lib/types";

export function RoleGate({ role, children }: { role: Role; children: React.ReactNode }) {
  const router = useRouter();
  const currentRole = useAuthStore((s) => s.role);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) router.replace("/login");
    else if (currentRole !== role) router.replace("/");
  }, [accessToken, currentRole, role, router]);

  return <>{children}</>;
}
