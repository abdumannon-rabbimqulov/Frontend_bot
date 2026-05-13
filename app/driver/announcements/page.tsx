"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { DriverAnnouncementCard } from "@/components/ui/kit";
import { driverApi } from "@/lib/api/endpoints";

export default function DriverAnnouncementsPage() {
  const { data } = useQuery({ queryKey: ["driver-announcements-own"], queryFn: driverApi.announcements });
  return (
    <AppShell role="driver" title="Driver Announcements">
      <div className="space-y-3">
        {data?.map((item: any) => (
          <Link key={item.id} href={`/driver/announcements/${item.id}/offers`}>
            <DriverAnnouncementCard item={item} />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
