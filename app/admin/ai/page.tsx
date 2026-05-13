"use client";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/endpoints";
import { DataTable } from "@/components/ui/kit";

export default function AdminAIPage() {
  const { data } = useQuery({ queryKey: ["admin-ai"], queryFn: adminApi.aiCommands });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">AI Commands</h1>
      <DataTable rows={data || []} />
    </div>
  );
}
