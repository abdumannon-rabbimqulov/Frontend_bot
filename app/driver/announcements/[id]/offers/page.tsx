"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { OfferCard } from "@/components/ui/kit";
import { apiClient } from "@/lib/api/client";

export default function DriverAnnouncementOffersPage() {
  const { id } = useParams<{ id: string }>();
  const offers = useQuery({
    queryKey: ["announcement-offers", id],
    queryFn: () => apiClient.get(`/drivers/announcements/${id}/offers`).then((r) => r.data),
  });

  return (
    <AppShell role="driver" title={`Announcement #${id} offers`}>
      <div className="space-y-3">{offers.data?.map((offer: any) => <OfferCard key={offer.id} offer={offer} />)}</div>
    </AppShell>
  );
}
