import { AppShell } from "@/components/layout/app-shell";
import { MapPreview, RouteTimeline } from "@/components/ui/kit";

export default function DriverActiveTripPage() {
  return (
    <AppShell role="driver" title="Active Trip">
      <MapPreview />
      <div className="mt-3">
        <RouteTimeline />
      </div>
    </AppShell>
  );
}
