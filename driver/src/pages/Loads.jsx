import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import DriverLayout from '../components/DriverLayout';

const mockLoads = [
  { id: 1, from: 'Toshkent', to: 'Buxoro', weight: '20 000 kg', price: '4 350 000', dist: '585 km', date: 'Bugun, 14:00', type: 'Elektr jihozlari' },
  { id: 2, from: 'Andijon', to: 'Navoiy', weight: '15 000 kg', price: '5 200 000', dist: '720 km', date: 'Bugun, 18:30', type: 'Qurilish materiallari' },
  { id: 3, from: 'Samarqand', to: 'Farg‘ona', weight: '12 000 kg', price: '3 100 000', dist: '310 km', date: 'Ertaga, 09:00', type: 'Oziq-ovqat' },
];

export default function Loads() {
  const nav = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = mockLoads.filter(l =>
    l.from.toLowerCase().includes(search.toLowerCase()) ||
    l.to.toLowerCase().includes(search.toLowerCase())
  );

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
          {filtered.length === 0 && <div className="text-center py-8 text-muted">Hech qanday yuk topilmadi</div>}
        </div>
      </div>
    </DriverLayout>
  );
}
