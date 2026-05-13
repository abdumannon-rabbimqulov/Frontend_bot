"use client";

import { RoleGate } from "@/components/layout/role-gate";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate role="admin">
      <div className="flex min-h-screen bg-[#020617] text-white">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </RoleGate>
  );
}
