"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState, LoadingSkeleton, OrderCard } from "@/components/ui/kit";
import { driverApi } from "@/lib/api/endpoints";

export default function DriverDashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ["driver-orders"], queryFn: driverApi.orders });
  return (
    <AppShell role="driver" title="Driver Dashboard">
      {isLoading && <LoadingSkeleton />}
      {!isLoading && !data?.length && <EmptyState text="No assigned orders" />}
      <div className="space-y-3">{data?.slice(0, 5).map((o: any) => <OrderCard key={o.id} order={o} />)}</div>
    </AppShell>
  );
}
