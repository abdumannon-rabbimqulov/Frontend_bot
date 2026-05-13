"use client";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/endpoints";
import { DataTable } from "@/components/ui/kit";

export default function AdminOrdersPage() {
  const { data } = useQuery({ queryKey: ["admin-orders"], queryFn: adminApi.orders });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      <DataTable rows={data || []} />
    </div>
  );
}
