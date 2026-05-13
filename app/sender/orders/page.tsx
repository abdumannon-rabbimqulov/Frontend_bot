"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingSkeleton, NeonButton, OrderCard } from "@/components/ui/kit";
import { senderApi } from "@/lib/api/endpoints";

export default function SenderOrdersPage() {
  const { data, isLoading } = useQuery({ queryKey: ["sender-orders-list"], queryFn: senderApi.orders });
  return (
    <AppShell role="sender" title="Sender Orders">
      <Link href="/sender/orders/create">
        <NeonButton>Create order</NeonButton>
      </Link>
      <div className="mt-4 space-y-3">
        {isLoading && <LoadingSkeleton />}
        {data?.map((o: any) => (
          <Link key={o.id} href={`/sender/orders/${o.id}`}>
            <OrderCard order={o} />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
