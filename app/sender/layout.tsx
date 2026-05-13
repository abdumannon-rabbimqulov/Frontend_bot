"use client";
import { RoleGate } from "@/components/layout/role-gate";

export default function SenderLayout({ children }: { children: React.ReactNode }) {
  return <RoleGate role="sender">{children}</RoleGate>;
}
