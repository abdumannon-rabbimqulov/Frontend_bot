"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState, LoadingSkeleton, OrderCard } from "@/components/ui/kit";
import { senderApi } from "@/lib/api/endpoints";

export default function SenderDashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ["sender-orders"], queryFn: senderApi.orders });
  return (
    <AppShell role="sender" title="Sender Dashboard">
      {isLoading && <LoadingSkeleton />}
      {!isLoading && !data?.length && <EmptyState text="No orders yet" />}
      <div className="space-y-3">{data?.slice(0, 5).map((o: any) => <OrderCard key={o.id} order={o} />)}</div>
    </AppShell>
  );
}
