"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth";

export function useRoleRedirect() {
  const router = useRouter();
  const { role, accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    if (role === "sender") router.replace("/sender/dashboard");
    else if (role === "driver") router.replace("/driver/dashboard");
    else if (role === "admin") router.replace("/admin/dashboard");
    else router.replace("/onboarding");
  }, [role, accessToken, router]);
}
