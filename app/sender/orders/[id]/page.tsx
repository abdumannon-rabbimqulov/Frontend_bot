"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { OfferCard, OrderCard } from "@/components/ui/kit";
import { senderApi } from "@/lib/api/endpoints";

export default function SenderOrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: order } = useQuery({ queryKey: ["order", params.id], queryFn: () => senderApi.orderById(params.id) });
  const { data: offers } = useQuery({ queryKey: ["order-offers", params.id], queryFn: () => senderApi.orderOffers(params.id) });

  return (
    <AppShell role="sender" title={`Order #${params.id}`}>
      {order && <OrderCard order={order} />}
      <div className="mt-3 space-y-2">{offers?.map((o: any) => <OfferCard key={o.id} offer={o} />)}</div>
    </AppShell>
  );
}
