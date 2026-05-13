import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DriverLayout from '../components/DriverLayout';
import { loads, offers } from '../lib/api';

export default function LoadDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const showOffer = searchParams.get('offer') === '1';
  const nav = useNavigate();
  const [offerPrice, setOfferPrice] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const { data: rawLoad, isLoading } = useQuery({
    queryKey: ['driverLoad', id],
    queryFn: () => loads.get(id),
  });
  const { data: loadOffers = [] } = useQuery({
    queryKey: ['loadOffers', id],
    queryFn: () => offers.listByOrder(id),
    enabled: !!id,
  });

  const load = rawLoad ? {
    id: rawLoad.id,
    from: rawLoad?.waypoints?.[0]?.address || 'Nomaʼlum',
    to: rawLoad?.waypoints?.[rawLoad?.waypoints?.length - 1]?.address || 'Nomaʼlum',
    weight: rawLoad.weight ? `${rawLoad.weight} t` : '—',
    volume: rawLoad.volume ? `${rawLoad.volume} m³` : '—',
    price: rawLoad.price ? `${Number(rawLoad.price).toLocaleString('ru-RU')} so‘m` : '—',
    dist: rawLoad.total_distance_km ? `${rawLoad.total_distance_km} km` : '—',
    route: (rawLoad?.waypoints || []).map((w) => w.address).filter(Boolean).join(' → '),
  } : null;

  const handleOffer = async () => {
    setError('');
    if (!offerPrice) {
      setError('Taklif narxini kiriting');
      return;
    }
    try {
      setSending(true);
      await offers.create(id, { offered_price: Number(offerPrice), comment });
      nav('/loads', { replace: true });
    } catch (e) {
      setError(e?.response?.data?.detail || 'Taklif yuborilmadi');
    } finally {
      setSending(false);
    }
  };

  return (
    <DriverLayout>
      <div className="px-4 pt-4">
        <button onClick={() => nav(-1)} className="mb-2 text-xs text-muted">← Orqaga</button>

        {isLoading && <div className="panel p-5 text-sm text-muted">Yuk maʼlumotlari yuklanmoqda...</div>}
        {!isLoading && !load && <div className="panel p-5 text-sm text-muted">Yuk topilmadi</div>}
        {load && <div className="panel p-5">
          <div className="text-xl font-bold">{load.from} → {load.to}</div>
          <div className="text-xs text-muted mt-1">Rejs #{id}</div>

          <div className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
            <div><span className="text-muted">Vazn</span> {load.weight}</div>
            <div><span className="text-muted">Hajm</span> {load.volume}</div>
            <div><span className="text-muted">Masofa</span> {load.dist}</div>
            <div><span className="text-muted">Narx</span> <span className="font-semibold text-success">{load.price}</span></div>
          </div>

          <div className="mt-4 rounded-2xl bg-white/5 p-4 text-xs">
            <div className="font-semibold mb-1">Yo‘nalish</div>
            {load.route}
          </div>
        </div>}

        {showOffer && load && (
          <div className="mt-4 panel p-5">
            <div className="font-semibold mb-3">Taklif berish</div>
            <input value={offerPrice} onChange={e => setOfferPrice(e.target.value)} placeholder="Taklif narxi (so‘m)" className="input w-full mb-3" type="number" />
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Izoh (ixtiyoriy)" className="input w-full h-20 resize-y mb-4" />
            {error && <div className="mb-3 text-sm text-danger">{error}</div>}
            <button onClick={handleOffer} disabled={sending} className="btn-primary w-full">
              {sending ? 'Yuborilmoqda...' : 'Yuborish'}
            </button>
          </div>
        )}

        {!showOffer && load && (
          <div className="mt-4 panel p-5">
            <div className="font-semibold mb-2">Bu yuk bo‘yicha takliflar</div>
            {loadOffers.length === 0 ? (
              <div className="text-sm text-muted">Hozircha takliflar yo‘q</div>
            ) : (
              <div className="space-y-2">
                {loadOffers.map((o) => (
                  <div key={o.id} className="rounded-xl border border-border p-3 text-sm">
                    <div className="flex justify-between">
                      <span>{Number(o.offered_price || 0).toLocaleString('ru-RU')} {o.currency || 'UZS'}</span>
                      <span className="text-xs text-muted">{o.status}</span>
                    </div>
                    {o.comment && <div className="text-xs text-muted mt-1">{o.comment}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 text-center">
          <button onClick={() => nav('/active')} className="text-xs text-primary">Bu yukni o‘z reysimga qo‘shish</button>
        </div>
      </div>
    </DriverLayout>
  );
}
