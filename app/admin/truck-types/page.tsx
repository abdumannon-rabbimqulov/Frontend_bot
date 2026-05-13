"use client";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/endpoints";
import { DataTable } from "@/components/ui/kit";

export default function AdminTruckTypesPage() {
  const { data } = useQuery({ queryKey: ["admin-truck-types"], queryFn: adminApi.truckTypes });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Truck Types</h1>
      <DataTable rows={data || []} />
    </div>
  );
}
