"use client";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/endpoints";
import { DataTable } from "@/components/ui/kit";

export default function AdminLiveMapPage() {
  const { data } = useQuery({ queryKey: ["admin-driver-locations"], queryFn: adminApi.driverLocations });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Live Map</h1>
      <DataTable rows={data || []} />
    </div>
  );
}
