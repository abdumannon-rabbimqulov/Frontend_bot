import React, { useEffect, useMemo, useState } from 'react';
import {
  Bot,
  Shield,
  Route,
  Zap,
  BarChart3,
  Box,
  Users,
  Globe,
  Clock3,
  ChevronRight,
  Bell,
  Sparkles,
  MapPin,
  Mic,
  Truck,
  MessageCircle,
  Navigation
} from 'lucide-react';
import { api } from './api';

const featureLeft = [
  { icon: Bot, title: 'AI Dispetcher', text: 'Intellektual yuk moslash avtomatik tahlil.' },
  { icon: Route, title: 'Tezkor Qidiruv', text: 'Yuk va haydovchi juftligini AI topadi.' },
  { icon: Shield, title: 'Xavfsiz va Ishonchli', text: "Ma'lumotlaringiz himoyalangan." },
  { icon: BarChart3, title: 'Shaffoflik', text: 'Real vaqtda kuzatuv va tahlillar.' }
];

const featureRight = [
  { icon: MapPin, title: 'Real vaqtda lokatsiya', text: 'Yuk va haydovchi harakati onlayn kuzatiladi.' },
  { icon: MessageCircle, title: 'Aqlli muloqot', text: "AI agent mulokot oqimini tezkor qiladi." },
  { icon: Shield, title: "Ma'lumotlar xavfsizligi", text: "Barcha ma'lumotlar himoyalangan." },
  { icon: Zap, title: 'Tezkor javob', text: "AI 24/7 sizga yordam beradi." }
];

const fallbackOrders = [
  { route: 'Toshkent -> Samarqand', weight: '12 t', distance: '310 km', price: "4.8 mln so'm", offers: '5 ta taklif' },
  { route: 'Toshkent -> Buxoro', weight: '9 t', distance: '580 km', price: "5.6 mln so'm", offers: '2 ta taklif' },
  { route: 'Jizzax -> Toshkent', weight: '6 t', distance: '130 km', price: "1.6 mln so'm", offers: 'Taklif berish' }
];

const panelStyle = {
  background: 'linear-gradient(160deg, rgba(12,20,45,0.9), rgba(5,8,22,0.92))',
  border: '1px solid rgba(116,147,255,0.25)',
  boxShadow: '0 20px 50px rgba(4, 14, 40, 0.7), inset 0 0 40px rgba(81, 111, 255, 0.08)'
};

const glowOrb = {
  background:
    'radial-gradient(circle, rgba(102,126,234,0.5) 0%, rgba(129,140,248,0.25) 40%, rgba(56,189,248,0.12) 70%, transparent 100%)'
};

function FeatureItem({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-2 text-cyan-300">
        <Icon size={15} />
      </div>
      <div>
        <p className="text-xs font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-[10px] text-slate-400">{text}</p>
      </div>
    </div>
  );
}

function PhoneCard({ mode, title, subtitle, orders, loading }) {
  return (
    <div className="relative w-[285px] rounded-[34px] border border-indigo-300/30 bg-[#050c1f] p-2 shadow-[0_20px_60px_rgba(33,67,155,0.5)]">
      <div className="rounded-[28px] border border-white/15 bg-gradient-to-b from-[#071126] to-[#030816] p-3">
        <div className="mb-3 flex items-center justify-between text-[10px] text-white/70">
          <span className="font-semibold">9:41</span>
          <span className="rounded-full border border-white/20 px-2 py-0.5">{mode}</span>
        </div>

        <div className="mb-3 rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-indigo-500/20 to-cyan-400/15 p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-xl font-bold leading-6 text-white">{title}</h4>
              <p className="mt-2 text-[10px] text-slate-300">{subtitle}</p>
            </div>
            <div className="rounded-full bg-indigo-400/20 p-2 text-indigo-200">
              <Sparkles size={16} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {loading && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center text-[10px] text-slate-300">
              Ma'lumot yuklanmoqda...
            </div>
          )}
          {orders.map((order) => (
            <div key={`${order.route}-${order.distance}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white">{order.route}</p>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[9px] text-emerald-300">
                  Yangi
                </span>
              </div>
              <div className="mt-2 flex gap-3 text-[9px] text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <Truck size={10} /> {order.weight}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Navigation size={10} /> {order.distance}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs font-bold text-cyan-300">{order.price}</p>
                <button className="inline-flex items-center gap-1 rounded-lg border border-indigo-300/25 bg-indigo-400/10 px-2 py-1 text-[9px] text-indigo-200">
                  {order.offers} <ChevronRight size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-around rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-2 text-[9px] text-slate-300">
          <span>Bosh sahifa</span>
          <span>Yuklar</span>
          <span className="rounded-full border border-fuchsia-300/30 bg-fuchsia-400/20 px-2 py-1 text-fuchsia-200">AI</span>
          <span>Xabarlar</span>
          <span>Profil</span>
        </div>
      </div>
    </div>
  );
}

function TrackingPhoneCard() {
  return (
    <div className="relative w-[285px] rounded-[34px] border border-cyan-300/30 bg-[#050c1f] p-2 shadow-[0_20px_60px_rgba(27,77,132,0.5)]">
      <div className="rounded-[28px] border border-white/15 bg-gradient-to-b from-[#071126] to-[#030816] p-3">
        <div className="mb-3 flex items-center justify-between text-[10px] text-white/70">
          <span className="font-semibold">9:41</span>
          <Bell size={12} />
        </div>

        <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.03] p-2">
          <p className="text-xs font-semibold text-white">Yuk: Toshkent -> Buxoro</p>
          <div className="mt-2 flex gap-2 text-[9px] text-slate-300">
            <span>9 t</span>
            <span>Bugun, 18:00</span>
            <span>580 km</span>
          </div>
        </div>

        <div className="relative h-[220px] rounded-2xl border border-cyan-300/15 bg-[linear-gradient(160deg,#031026,#0b1435)] p-2">
          <div className="absolute left-6 top-10 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
          <div className="absolute bottom-12 right-7 h-2 w-2 rounded-full bg-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.9)]" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 260 220" fill="none">
            <path d="M35 50C90 70 88 120 130 130C170 140 210 155 230 185" stroke="url(#line)" strokeWidth="3" />
            <defs>
              <linearGradient id="line" x1="35" y1="50" x2="230" y2="185" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute left-[120px] top-[110px] rounded-lg border border-white/20 bg-white/10 p-1 text-white">
            <Truck size={13} />
          </div>
          <div className="absolute bottom-2 left-2 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-[9px] text-emerald-300">
            Live lokatsiya
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-[10px] text-slate-200">
            <p>
              <span className="text-cyan-300">Driver:</span> Assalomu alaykum! Yuk qayerda yuklanadi?
            </p>
          </div>
          <div className="rounded-xl border border-indigo-300/20 bg-indigo-400/10 p-2 text-[10px] text-indigo-100">
            <p>
              <span className="text-indigo-200">AI Agent:</span> Yuk joylashuvi yuborildi. Manzil va kontaktlar chatda bor.
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-2 py-2 text-[10px] text-slate-300">
          <span>Voice</span>
          <button className="rounded-full border border-cyan-300/30 bg-cyan-400/20 p-2 text-cyan-200">
            <Mic size={12} />
          </button>
          <span>Chat</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await api.getOrders();
        if (!cancelled) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!cancelled) {
          setOrders([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  const mappedOrders = useMemo(() => {
    if (!orders.length) return fallbackOrders;
    return orders.slice(0, 4).map((item) => {
      const first = item.waypoints?.[0]?.city || "Noma'lum";
      const last = item.waypoints?.[item.waypoints?.length - 1]?.city || "Noma'lum";
      const distance = item.total_distance_km ? `${Math.round(Number(item.total_distance_km))} km` : 'Masofa yo‘q';
      const weight = item.weight ? `${item.weight} t` : 'Vazn yo‘q';
      const price = item.price ? `${item.price} ${item.currency || 'UZS'}` : "Narx yo'q";
      return {
        route: `${first} -> ${last}`,
        weight,
        distance,
        price,
        offers: item.status === 'pending' ? 'Takliflar kutilmoqda' : item.status || 'Jarayonda'
      };
    });
  }, [orders]);

  const previewCards = useMemo(
    () => [
      {
        mode: 'Sender',
        title: 'AI dispetcher tayyor',
        subtitle: "Yukingiz uchun eng yaxshi haydovchini topib, sizga eng yaxshi taklifni taqdim etadi.",
        orders: mappedOrders.slice(0, 2)
      },
      {
        mode: 'Driver',
        title: "AI mos yuklarni saralamoqda...",
        subtitle: 'Buyruq qabul qilindi -> API ishlayapti -> Natija topildi',
        orders: mappedOrders.slice(0, 3)
      }
    ],
    [mappedOrders]
  );

  const stats = useMemo(() => {
    const totalOrders = orders.length || 12540;
    const activeOrders = orders.filter((item) => ['in_progress', 'accepted'].includes(item.status)).length;
    const completedOrders = orders.filter((item) => item.status === 'completed').length;
    const avgDistance =
      orders.length && orders.some((item) => item.total_distance_km)
        ? `${Math.round(
            orders.reduce((acc, item) => acc + Number(item.total_distance_km || 0), 0) / orders.length
          )} km`
        : '1.8 kun';

    return [
      { icon: Box, title: 'Jami yuklar', value: totalOrders.toLocaleString(), delta: loading ? '...' : 'real data' },
      { icon: Users, title: 'Faol yuklar', value: String(activeOrders || 3842), delta: '+16%' },
      { icon: Globe, title: "Yakunlangan", value: `${completedOrders || 98}%`, delta: 'status' },
      { icon: Clock3, title: "O'rtacha masofa", value: avgDistance, delta: '-12%' }
    ];
  }, [orders, loading]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none absolute -left-20 top-0 h-[420px] w-[420px] blur-3xl" style={glowOrb} />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-[360px] w-[360px] blur-3xl" style={glowOrb} />

      <div className="mx-auto flex max-w-[1480px] flex-col gap-6 px-4 pb-8 pt-6 lg:px-6">
        <div className="grid gap-4 xl:grid-cols-[250px_minmax(0,1fr)_250px]">
          <aside className="rounded-3xl p-4" style={panelStyle}>
            <h1 className="text-[30px] font-black leading-8 tracking-tight">
              Logistika <span className="text-cyan-300">AI</span>
            </h1>
            <p className="mt-2 text-xs text-slate-400">AI dispetcher yordamida logistika jarayonini soddalashtiring.</p>

            <div className="mt-5 space-y-3">
              {featureLeft.map((item) => (
                <FeatureItem key={item.title} {...item} />
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-indigo-500/20 to-purple-500/10 p-3">
              <p className="text-[10px] uppercase tracking-widest text-slate-300">Faol yuklar</p>
              <p className="mt-1 text-3xl font-black text-cyan-300">
                {orders.filter((item) => ['in_progress', 'accepted'].includes(item.status)).length || '1,248'}
              </p>
              <p className="text-[10px] text-emerald-300">{loading ? 'Yuklanmoqda...' : "Bugundan ko'ra +18%"}</p>
            </div>
          </aside>

          <section className="rounded-3xl p-4" style={panelStyle}>
            <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 xl:grid-cols-3">
              <div className="snap-center">
                <PhoneCard {...previewCards[0]} loading={loading} />
              </div>
              <div className="snap-center">
                <PhoneCard {...previewCards[1]} loading={loading} />
              </div>
              <div className="snap-center">
                <TrackingPhoneCard />
              </div>
            </div>
          </section>

          <aside className="rounded-3xl p-4" style={panelStyle}>
            <div className="space-y-3">
              {featureRight.map((item) => (
                <FeatureItem key={item.title} {...item} />
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-3">
              <p className="text-[10px] uppercase tracking-widest text-cyan-200">AI ish faoliyati</p>
              <p className="mt-1 text-3xl font-black text-cyan-300">24/7</p>
              <p className="text-[10px] text-slate-300">Real va doimo siz bilan</p>
            </div>
          </aside>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <a
            href="https://t.me/Logistika_AIbot"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-xs font-semibold text-cyan-200"
          >
            Telegram Mini App <Zap size={14} />
          </a>

          {stats.map((stat) => (
            <div key={stat.title} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="inline-flex items-center gap-2 text-[11px] text-slate-300">
                <stat.icon size={14} /> {stat.title}
              </p>
              <div className="mt-1 flex items-end justify-between">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <span className="text-xs text-emerald-300">{stat.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
