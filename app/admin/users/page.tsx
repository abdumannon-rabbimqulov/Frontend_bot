"use client";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/endpoints";
import { DataTable } from "@/components/ui/kit";

export default function AdminUsersPage() {
  const { data } = useQuery({ queryKey: ["admin-users"], queryFn: adminApi.users });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Users</h1>
      <DataTable rows={data || []} />
    </div>
  );
}
