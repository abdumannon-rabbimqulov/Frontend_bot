import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import DriverLayout from '../components/DriverLayout';

export default function LoadDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const showOffer = searchParams.get('offer') === '1';
  const nav = useNavigate();
  const [offerPrice, setOfferPrice] = useState('');
  const [comment, setComment] = useState('');

  // Mock load
  const load = { id, from: 'Toshkent', to: 'Buxoro', weight: '20 000 kg', volume: '82 m³', price: '4 350 000', dist: '585 km', date: 'Bugun, 14:00', type: 'Elektr jihozlari', company: 'Global Tech LLC' };

  const handleOffer = () => {
    alert(`Taklif yuborildi: ${offerPrice} so‘m\nIzoh: ${comment}`);
    nav('/loads');
  };

  return (
    <DriverLayout>
      <div className="px-4 pt-4">
        <button onClick={() => nav(-1)} className="mb-2 text-xs text-muted">← Orqaga</button>

        <div className="panel p-5">
          <div className="text-xl font-bold">{load.from} → {load.to}</div>
          <div className="text-xs text-muted mt-1">Rejs #{id} • {load.company}</div>

          <div className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
            <div><span className="text-muted">Vazn</span> {load.weight}</div>
            <div><span className="text-muted">Hajm</span> {load.volume}</div>
            <div><span className="text-muted">Masofa</span> {load.dist}</div>
            <div><span className="text-muted">Narx</span> <span className="font-semibold text-success">{load.price}</span></div>
          </div>

          <div className="mt-4 rounded-2xl bg-white/5 p-4 text-xs">
            <div className="font-semibold mb-1">Yo‘nalish</div>
            Toshkent, Sergeli → Buxoro, Qorako‘l • 585 km
          </div>
        </div>

        {showOffer && (
          <div className="mt-4 panel p-5">
            <div className="font-semibold mb-3">Taklif berish</div>
            <input value={offerPrice} onChange={e => setOfferPrice(e.target.value)} placeholder="Taklif narxi (so‘m)" className="input w-full mb-3" type="number" />
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Izoh (ixtiyoriy)" className="input w-full h-20 resize-y mb-4" />
            <button onClick={handleOffer} className="btn-primary w-full">Yuborish</button>
          </div>
        )}

        <div className="mt-4 text-center">
          <button onClick={() => nav('/active')} className="text-xs text-primary">Bu yukni o‘z reysimga qo‘shish</button>
        </div>
      </div>
    </DriverLayout>
  );
}
