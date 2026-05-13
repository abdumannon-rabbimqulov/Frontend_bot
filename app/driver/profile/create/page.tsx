"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { NeonButton } from "@/components/ui/kit";
import { driverApi } from "@/lib/api/endpoints";

export default function DriverProfileCreatePage() {
  const [truckType, setTruckType] = useState(1);
  const [truckNumber, setTruckNumber] = useState("");
  const [city, setCity] = useState("");
  const types = useQuery({ queryKey: ["truck-types"], queryFn: driverApi.truckTypes });
  const mutation = useMutation({ mutationFn: driverApi.profileCreate });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({ truck_type_id: truckType, truck_number: truckNumber, current_city: city });
  };

  return (
    <AppShell role="driver" title="Create Driver Profile">
      <form onSubmit={submit} className="space-y-3">
        <select className="w-full rounded-xl bg-white/10 p-3" value={truckType} onChange={(e) => setTruckType(Number(e.target.value))}>
          {types.data?.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <input className="w-full rounded-xl bg-white/10 p-3" value={truckNumber} onChange={(e) => setTruckNumber(e.target.value)} placeholder="Truck number" />
        <input className="w-full rounded-xl bg-white/10 p-3" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Current city" />
        <NeonButton type="submit">Save profile</NeonButton>
      </form>
    </AppShell>
  );
}
