"use client";
import { useRoleRedirect } from "@/hooks/use-role-redirect";

export default function HomePage() {
  useRoleRedirect();
  return <div className="p-6 text-sm text-slate-400">Redirecting...</div>;
}
