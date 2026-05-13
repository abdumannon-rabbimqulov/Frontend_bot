import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Truck, MapPin, MessageCircle, Award } from 'lucide-react';
import DriverLayout from '../components/DriverLayout';
import { ai, announcements, driverProfile, loads } from '../lib/api';

export default function Dashboard() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data: loadItems = [] } = useQuery({
    queryKey: ['dashboardLoads'],
    queryFn: () => loads.list(),
  });
  const { data: me } = useQuery({
    queryKey: ['driverMe'],
    queryFn: driverProfile.me,
  });
  const { data: myAnnouncements = [] } = useQuery({
    queryKey: ['myAnnouncements', me?.id],
    queryFn: () => announcements.list({ driver_id: me?.id }),
    enabled: !!me?.id,
  });
  const { data: usage } = useQuery({
    queryKey: ['aiUsage'],
    queryFn: ai.usage,
  });
  const liveOn = me?.is_available ?? false;
  const availabilityMutation = useMutation({
    mutationFn: (value) => driverProfile.update({ is_available: value }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['driverMe'] }),
  });
  const loadsCount = Array.isArray(loadItems) ? loadItems.length : 0;

  return (
    <DriverLayout>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Truck className="text-primary" size={18} />
            </div>
            <div>
              <div className="text-lg font-bold">Logistika AI</div>
              <div className="text-xs text-muted">Haydovchi</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className={`rounded-full px-3 py-1 ${liveOn ? 'bg-success/20 text-success' : 'bg-white/10'}`}>
            {liveOn ? 'LIVE' : 'OFF'}
          </div>
          <button
            onClick={() => availabilityMutation.mutate(!liveOn)}
            disabled={availabilityMutation.isPending}
            className="rounded-full border border-white/20 px-3 py-1 text-xs active:scale-95"
          >
            {liveOn ? 'O‘chirish' : 'Yoqish'}
          </button>
        </div>
      </div>

      {/* KPI Card */}
      <div className="mx-4 mt-2 rounded-3xl bg-gradient-to-br from-primary/20 to-indigo-500/10 p-5 border border-primary/30">
        <div className="flex justify-between">
          <div>
            <div className="text-sm text-muted">Mavjud yuklar</div>
            <div className="text-6xl font-bold tracking-tighter">{loadsCount}</div>
          </div>
          <div className="text-right">
            <div className="inline-block rounded-2xl bg-white/10 p-3">
              <Truck size={42} className="text-primary" />
            </div>
            <div className="mt-1 text-xs text-muted">Yangilanib turadi</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        <button onClick={() => nav('/loads')} className="panel p-4 text-left active:scale-[0.985]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2"><MapPin className="text-primary" /></div>
            <div>
              <div className="font-semibold">Yuk qidirish</div>
              <div className="text-xs text-muted">{loadsCount} ta yuk</div>
            </div>
          </div>
        </button>
        <button onClick={() => nav('/profile')} className="panel p-4 text-left active:scale-[0.985]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-warning/10 p-2"><Award className="text-warning" /></div>
            <div>
              <div className="font-semibold">Profil</div>
              <div className="text-xs text-muted">Ma'lumotlarni yangilang</div>
            </div>
          </div>
        </button>
        <button onClick={() => nav('/active')} className="panel p-4 text-left active:scale-[0.985]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-success/10 p-2"><Truck className="text-success" /></div>
            <div>
              <div className="font-semibold">Aktiv reys</div>
              <div className="text-xs text-muted">Haqiqiy holat backenddan olinadi</div>
            </div>
          </div>
        </button>
        <button onClick={() => nav('/chat')} className="panel p-4 text-left active:scale-[0.985]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2"><MessageCircle className="text-primary" /></div>
            <div>
              <div className="font-semibold">AI Chat</div>
              <div className="text-xs text-muted">Yuk haqida so'rang</div>
            </div>
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="mx-4 mt-6">
        <div className="mb-2 flex items-center justify-between px-1">
          <div className="font-semibold">Statistika</div>
          <div className="text-xs text-muted">API orqali real holat</div>
        </div>
        <div className="panel p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted text-xs">Mening e'lonlarim</div>
              <div className="font-semibold">{myAnnouncements.length}</div>
            </div>
            <div>
              <div className="text-muted text-xs">AI so'rovlar (bugun)</div>
              <div className="font-semibold">{usage?.requests ?? usage?.total_requests ?? 0}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-4 text-center text-xs text-muted pb-4">
        Faqat real ma'lumotlar ko‘rsatiladi
      </div>
    </DriverLayout>
  );
}
