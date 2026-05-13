"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { OrderCard } from "@/components/ui/kit";
import { driverApi } from "@/lib/api/endpoints";

export default function DriverOrdersPage() {
  const { data } = useQuery({ queryKey: ["driver-orders-list"], queryFn: driverApi.orders });
  return (
    <AppShell role="driver" title="Driver Orders">
      <div className="space-y-3">
        {data?.map((o: any) => (
          <Link key={o.id} href={`/driver/orders/${o.id}/offer`}>
            <OrderCard order={o} />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
