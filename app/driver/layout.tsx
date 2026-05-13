"use client";
import { RoleGate } from "@/components/layout/role-gate";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return <RoleGate role="driver">{children}</RoleGate>;
}
