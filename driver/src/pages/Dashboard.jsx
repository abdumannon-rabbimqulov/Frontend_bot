import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, MessageCircle, Award } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DriverLayout from '../components/DriverLayout';

const chartData = [
  { day: 'Du', km: 120 }, { day: 'Se', km: 80 }, { day: 'Ch', km: 200 },
  { day: 'Pa', km: 150 }, { day: 'Ju', km: 320 }, { day: 'Sh', km: 90 }, { day: 'Ya', km: 180 },
];

export default function Dashboard() {
  const nav = useNavigate();
  const [liveOn, setLiveOn] = useState(true);

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
            onClick={() => setLiveOn(!liveOn)}
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
            <div className="text-sm text-muted">Bugungi mos yuklar</div>
            <div className="text-6xl font-bold tracking-tighter">12</div>
          </div>
          <div className="text-right">
            <div className="inline-block rounded-2xl bg-white/10 p-3">
              <Truck size={42} className="text-primary" />
            </div>
            <div className="mt-1 text-xs text-muted">Boshqa 8 ta yuk</div>
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
              <div className="text-xs text-muted">12 ta mos yuk</div>
            </div>
          </div>
        </button>
        <button onClick={() => alert('Bo\'sh joy e\'loni yaratish (keyingi versiyada)')} className="panel p-4 text-left active:scale-[0.985]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-warning/10 p-2"><Award className="text-warning" /></div>
            <div>
              <div className="font-semibold">Bo'sh joy e'loni</div>
              <div className="text-xs text-muted">Yukingizni e'lon qiling</div>
            </div>
          </div>
        </button>
        <button onClick={() => nav('/active')} className="panel p-4 text-left active:scale-[0.985]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-success/10 p-2"><Truck className="text-success" /></div>
            <div>
              <div className="font-semibold">Aktiv reys</div>
              <div className="text-xs text-muted">Toshkent → Buxoro</div>
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
          <div className="font-semibold">Daraomd statistikasi</div>
          <div className="text-xs text-muted">Bugun • 2 ta reys</div>
        </div>
        <div className="panel p-4">
          <div className="text-3xl font-bold">3 240 000 <span className="text-base font-normal text-muted">so‘m</span></div>
          <div className="text-xs text-success">+320 km • +18%</div>
          <div className="mt-4 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{fontSize:10, fill:'#64748b'}} />
                <YAxis hide />
                <Tooltip contentStyle={{background:'#0f172a', border:'none', borderRadius:8}} />
                <Area type="natural" dataKey="km" stroke="#38bdf8" fill="url(#colorKm)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity hint */}
      <div className="mx-4 mt-4 text-center text-xs text-muted pb-4">
        Eng so‘nggi: Andijon → Navoiy • 150 km • 5.2 mln so‘m
      </div>
    </DriverLayout>
  );
}
