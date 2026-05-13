"use client";

import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { NeonButton, OrderCard } from "@/components/ui/kit";
import { driverApi, senderApi } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";

export default function DriverOrderOfferPage() {
  const { id } = useParams<{ id: string }>();
  const [price, setPrice] = useState("");
  const order = useQuery({ queryKey: ["driver-order", id], queryFn: () => senderApi.orderById(id) });
  const mutation = useMutation({
    mutationFn: (payload: any) => apiClient.post(`/orders/${id}/offers`, payload).then((r) => r.data),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({ offered_price: price, comment: "Driver offer" });
  };

  return (
    <AppShell role="driver" title={`Offer for #${id}`}>
      {order.data && <OrderCard order={order.data} />}
      <form onSubmit={submit} className="mt-3 space-y-3">
        <input className="w-full rounded-xl bg-white/10 p-3" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Offered price" />
        <NeonButton type="submit">{mutation.isPending ? "Sending..." : "Send offer"}</NeonButton>
      </form>
    </AppShell>
  );
}
