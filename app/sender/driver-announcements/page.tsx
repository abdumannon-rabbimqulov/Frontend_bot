"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { DriverAnnouncementCard, LoadingSkeleton } from "@/components/ui/kit";
import { senderApi } from "@/lib/api/endpoints";

export default function SenderDriverAnnouncementsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["driver-announcements"], queryFn: senderApi.driverAnnouncements });
  return (
    <AppShell role="sender" title="Driver Announcements">
      {isLoading && <LoadingSkeleton />}
      <div className="space-y-3">{data?.map((item: any) => <DriverAnnouncementCard key={item.id} item={item} />)}</div>
    </AppShell>
  );
}
