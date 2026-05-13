import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import DriverLayout from '../components/DriverLayout';
import { loads } from '../lib/api';

export default function Loads() {
  const nav = useNavigate();
  const [search, setSearch] = useState('');
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['driverLoads'],
    queryFn: () => loads.list(),
  });

  const filtered = items.filter((load) => {
    const from = String(load?.waypoints?.[0]?.address || '').toLowerCase();
    const to = String(load?.waypoints?.[load?.waypoints?.length - 1]?.address || '').toLowerCase();
    const q = search.toLowerCase();
    return from.includes(q) || to.includes(q);
  }).map((load) => ({
    id: load.id,
    from: load?.waypoints?.[0]?.address || 'Nomaʼlum',
    to: load?.waypoints?.[load?.waypoints?.length - 1]?.address || 'Nomaʼlum',
    weight: load.weight ? `${load.weight} t` : '—',
    price: load.price ? Number(load.price).toLocaleString('ru-RU') : '—',
    dist: load.total_distance_km ? `${load.total_distance_km} km` : '—',
    date: load.created_at ? new Date(load.created_at).toLocaleString('uz-UZ') : '—',
  }));

  return (
    <DriverLayout>
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xl font-bold">Yuklar lentasi</div>
          <button onClick={() => nav('/active')} className="text-xs rounded-full border px-3 py-1">Aktiv reys</button>
        </div>

        <div className="relative mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Qidirish (Toshkent, Buxoro...)"
            className="input w-full pl-10"
          />
          <Search className="absolute left-3 top-3 text-muted" size={18} />
        </div>

        <div className="space-y-3">
          {isLoading && <div className="text-center py-8 text-muted">Yuklar yuklanmoqda...</div>}
          {filtered.map(load => (
            <div key={load.id} onClick={() => nav(`/loads/${load.id}`)} className="panel p-4 active:scale-[0.985] cursor-pointer">
              <div className="flex justify-between text-sm">
                <div className="font-semibold">{load.from} → {load.to}</div>
                <div className="text-xs text-muted">{load.date}</div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-muted">Vazn</span><br />{load.weight}</div>
                <div><span className="text-muted">Narx</span><br /><span className="font-semibold text-success">{load.price}</span> so‘m</div>
                <div><span className="text-muted">Masofa</span><br />{load.dist}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); nav(`/loads/${load.id}`); }} className="btn-outline flex-1 text-xs">Ko‘rish</button>
                <button onClick={(e) => { e.stopPropagation(); nav(`/loads/${load.id}?offer=1`); }} className="btn-primary flex-1 text-xs">Taklif berish</button>
              </div>
            </div>
          ))}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-8 text-muted">Hozircha yuklar mavjud emas</div>
          )}
        </div>
      </div>
    </DriverLayout>
  );
}
