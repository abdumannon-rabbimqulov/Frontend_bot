"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/endpoints";
import { AdminStatsCard, LoadingSkeleton } from "@/components/ui/kit";

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: adminApi.dashboardStats });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
      {isLoading && <LoadingSkeleton />}
      <div className="grid gap-3 md:grid-cols-3">
        <AdminStatsCard title="Users" value={data?.users || "-"} />
        <AdminStatsCard title="Orders" value={data?.orders || "-"} />
        <AdminStatsCard title="Revenue" value={data?.revenue || "-"} />
      </div>
    </div>
  );
}
