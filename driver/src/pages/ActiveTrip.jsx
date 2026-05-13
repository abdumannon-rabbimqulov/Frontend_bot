import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DriverLayout from '../components/DriverLayout';
import { driverProfile, trips } from '../lib/api';

export default function ActiveTrip() {
  const nav = useNavigate();
  const { data: me } = useQuery({
    queryKey: ['driverMe'],
    queryFn: driverProfile.me,
  });
  const { data: activeTrip, isLoading } = useQuery({
    queryKey: ['activeTrip', me?.id],
    queryFn: () => trips.active(me?.id),
    enabled: !!me?.id,
  });

  return (
    <DriverLayout>
      <div className="px-4 pt-4">
        {isLoading && <div className="panel p-5 text-sm text-muted">Reys ma'lumotlari yuklanmoqda...</div>}
        {!isLoading && !activeTrip && (
          <div className="panel p-5 text-center">
            <div className="font-semibold">Aktiv reys mavjud emas</div>
            <div className="mt-2 text-sm text-muted">
              Qabul qilingan yoki davom etayotgan buyurtmalar shu yerda ko‘rinadi.
            </div>
          </div>
        )}
        {!isLoading && activeTrip && (
          <div className="panel p-5">
            <div className="font-semibold">Aktiv reys #{activeTrip.id}</div>
            <div className="text-sm text-muted mt-1">{activeTrip.status}</div>
            <div className="mt-3 text-sm">
              {(activeTrip.waypoints || []).map((w) => w.address).filter(Boolean).join(' → ')}
            </div>
          </div>
        )}

        <div className="mt-3 text-center">
          <button onClick={() => nav('/chat')} className="text-xs text-primary">Mijoz bilan chat ochish</button>
        </div>
      </div>
    </DriverLayout>
  );
}
