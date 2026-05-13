"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { NeonButton } from "@/components/ui/kit";
import { senderApi } from "@/lib/api/endpoints";

export default function SenderCreateOrderPage() {
  const [cargo, setCargo] = useState("");
  const [price, setPrice] = useState("");
  const mutation = useMutation({
    mutationFn: senderApi.createOrder,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      cargo_name: cargo,
      weight: 1,
      required_truck_type_id: 1,
      price,
      customer_id: 1,
      waypoints: [{ city: "Toshkent", waypoint_type: "pickup" }, { city: "Samarqand", waypoint_type: "delivery" }],
    });
  };

  return (
    <AppShell role="sender" title="Create Order">
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded-xl bg-white/10 p-3 text-sm" value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Cargo name" />
        <input className="w-full rounded-xl bg-white/10 p-3 text-sm" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
        <NeonButton type="submit">{mutation.isPending ? "Saving..." : "Create"}</NeonButton>
        {mutation.isSuccess && <p className="text-sm text-emerald-400">Order created</p>}
      </form>
    </AppShell>
  );
}
