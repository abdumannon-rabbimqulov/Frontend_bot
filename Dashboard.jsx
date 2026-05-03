import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Package, 
  MapPin, 
  Search, 
  User, 
  Bell, 
  X, 
  ChevronRight, 
  Star, 
  Navigation,
  Filter,
  Sparkles,
  Cpu,
  Navigation2,
  Box,
  LogOut,
  ShieldCheck,
  Smartphone,
  Wallet,
  History,
  HandCoins,
  Plus,
  ArrowUpRight,
  ClipboardList,
  Users,
  Timer,
  LayoutDashboard,
  CheckCircle2,
  Phone,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { api } from './api';

// --- Konfiguratsiya ---
const COLORS = {
  bg: '#050610',
  glass: 'rgba(255, 255, 255, 0.04)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
};

// --- Komponentlar ---
const BrandLogo = () => (
  <div className="flex items-center gap-2.5">
    <div className="relative">
      <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
        <Cpu size={22} className="text-white" />
      </div>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-black text-xl tracking-tighter italic text-white">LOGI<span className="text-purple-400 not-italic">AI</span></span>
      <span className="text-[8px] font-bold text-white/40 tracking-[0.2em] uppercase">Logistics Intelligence</span>
    </div>
  </div>
);

const GlassCard = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`backdrop-blur-2xl border rounded-3xl transition-all ${className}`}
    style={{ backgroundColor: COLORS.glass, borderColor: COLORS.glassBorder }}
  >
    {children}
  </div>
);

// --- MODAL: TAKLIFLAR TAFSILOTI ---
const OffersDetailsModal = ({ isOpen, onClose, selectedOrder, onAcceptSuccess }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmedDriver, setConfirmedDriver] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && selectedOrder) {
      loadOffers();
    } else {
      setOffers([]);
      setError(null);
    }
  }, [isOpen, selectedOrder]);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const data = await api.getOrderOffers(selectedOrder.id);
      setOffers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (offer) => {
    setLoading(true);
    try {
      await api.acceptOffer(offer.id);
      setConfirmedDriver(offer);
      if (onAcceptSuccess) onAcceptSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (confirmedDriver) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
        <div className="text-center space-y-6 animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-cyan-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.5)]">
            <CheckCircle2 size={48} className="text-black" />
          </div>
          <h2 className="text-3xl font-black italic">Muvaffaqiyatli!</h2>
          <p className="text-white/50 text-sm">Haydovchi taklifi qabul qilindi. Yuk statusi yangilandi.</p>
          <button onClick={() => { setConfirmedDriver(null); onClose(); }} className="w-full py-4 bg-white text-black font-black rounded-2xl text-xs uppercase">Yopish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0a0c1a] border-t border-white/10 rounded-t-[3rem] p-7 h-[80vh] flex flex-col animate-in slide-in-from-bottom">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black italic tracking-tighter">Takliflar ({offers.length})</h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full"><X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="animate-spin text-cyan-400" size={32} />
              <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Yuklanmoqda...</p>
            </div>
          )}
          
          {!loading && offers.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-white/30 text-sm italic">Hozircha takliflar yo'q</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          {offers.map(offer => (
            <GlassCard key={offer.id} className="p-5 border-white/5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${offer.driver_id}`} className="w-12 h-12 rounded-xl bg-white/5" alt="driver" />
                  <div>
                    <h4 className="font-bold">Haydovchi #{offer.driver_id}</h4>
                    <span className="text-[10px] text-white/40 uppercase">ID: {offer.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 font-black">{offer.price} {offer.currency}</p>
                </div>
              </div>
              <button 
                onClick={() => handleAccept(offer)} 
                disabled={loading}
                className="w-full py-3 bg-cyan-500 text-black font-black text-[10px] rounded-xl uppercase tracking-widest shadow-lg disabled:opacity-50"
              >
                Tasdiqlash
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- SENDER DASHBOARD ---
const SenderDashboard = ({ onShowOffers, orders, loading, onRefresh }) => {
  const activeCount = orders.filter(o => o.status === 'active').length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="px-5 pt-4 pb-32 space-y-6 overflow-y-auto h-full no-scrollbar">
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
          <p className="text-[10px] font-black text-cyan-400 uppercase">Faol yuklar</p>
          <h3 className="text-3xl font-black mt-1">{activeCount.toString().padStart(2, '0')}</h3>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-[10px] font-black text-white/40 uppercase">Kutilmoqda</p>
          <h3 className="text-3xl font-black mt-1">{pendingCount.toString().padStart(2, '0')}</h3>
        </GlassCard>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black tracking-tight italic">Mening yuklarim</h2>
        <button onClick={onRefresh} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ArrowUpRight size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="space-y-4">
        {loading && orders.length === 0 && (
          <div className="py-20 text-center">
            <Loader2 className="animate-spin text-cyan-400 mx-auto" size={32} />
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Package size={48} className="text-white/10 mx-auto" />
            <p className="text-white/30 text-sm">Sizda hali yuklar yo'q</p>
            <button className="px-6 py-3 bg-white text-black font-black text-[10px] rounded-xl uppercase">Yuk qo'shish</button>
          </div>
        )}

        {orders.map(item => (
          <GlassCard key={item.id} className="p-5 border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-black text-lg">{item.cargo_name}</h4>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-white/40 font-bold uppercase">
                  <MapPin size={12}/> {item.from_location?.address || 'Noma\'lum'} - {item.to_location?.address || 'Noma\'lum'}
                </div>
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded border ${
                item.status === 'active' ? 'text-emerald-400 border-emerald-400/20' : 
                item.status === 'pending' ? 'text-amber-400 border-amber-400/20' : 
                'text-white/40 border-white/10'
              }`}>
                {item.status.toUpperCase()}
              </span>
            </div>
            <div className="flex gap-2">
               <button 
                onClick={() => onShowOffers(item)} 
                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-cyan-400"
              >
                Takliflar ({item.offers_count || 0})
              </button>
              <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40">
                <ChevronRight size={18} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// --- DRIVER LENTA (Placeholder for now) ---
const LentaScreen = () => (
  <div className="px-5 pt-4 pb-32 space-y-4 text-center py-20">
    <Truck size={48} className="text-purple-400 mx-auto opacity-20" />
    <h2 className="text-2xl font-black italic opacity-20">Haydovchi rejimi tez kunda...</h2>
  </div>
);

// --- PROFIL ---
const ProfileScreen = ({ mode, setMode }) => {
  return (
    <div className="px-5 pt-4 pb-32 h-full overflow-y-auto no-scrollbar text-center space-y-6">
      <div className="pt-6">
        <div className={`w-24 h-24 rounded-3xl mx-auto mb-4 p-1 ${mode === 'driver' ? 'bg-gradient-to-tr from-purple-600 to-indigo-600' : 'bg-gradient-to-tr from-cyan-500 to-blue-600'}`}>
          <div className="w-full h-full bg-[#050610] rounded-[1.4rem] flex items-center justify-center overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mode === 'driver' ? 'Felix' : 'Sarah'}`} className="w-20" alt="Avatar" />
          </div>
        </div>
        <h2 className="text-2xl font-black">{mode === 'driver' ? 'Haydovchi' : 'Yuk Beruvchi'}</h2>
      </div>
      <div className="p-1.5 bg-white/5 rounded-2xl border border-white/10 flex">
        <button onClick={() => setMode('driver')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'driver' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-white/20'}`}>Haydovchi</button>
        <button onClick={() => setMode('sender')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'sender' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-white/20'}`}>Yuk beruvchi</button>
      </div>
      <div className="space-y-2">
        <button className="w-full p-4 flex items-center justify-between rounded-2xl bg-white/5"><div className="flex items-center gap-4 text-sm font-bold"><ShieldCheck size={20} className="text-green-400" /> Xavfsizlik</div><ChevronRight size={18} className="text-white/10" /></button>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full p-4 flex items-center justify-between rounded-2xl bg-white/5 text-red-400"><div className="flex items-center gap-4 text-sm font-bold"><LogOut size={20} /> Chiqish</div></button>
      </div>
    </div>
  );
};

// --- ASOSIY ILOVA ---
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [mode, setMode] = useState('sender'); 
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'sender') {
      loadOrders();
    }
  }, [mode]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const navigation = mode === 'driver' ? [
    { id: 'home', icon: Truck, label: 'Lenta' },
    { id: 'map', icon: Navigation, label: 'Xarita' },
    { id: 'orders', icon: Package, label: 'Safarlar' },
    { id: 'profile', icon: User, label: 'Profil' }
  ] : [
    { id: 'home', icon: LayoutDashboard, label: 'Panel' },
    { id: 'orders', icon: ClipboardList, label: 'Yuklarim' },
    { id: 'drivers', icon: Users, label: 'Haydovchilar' },
    { id: 'profile', icon: User, label: 'Profil' }
  ];

  return (
    <div className="fixed inset-0 bg-[#050610] text-white font-sans overflow-hidden select-none">
      <header className="px-5 pt-14 pb-5 flex justify-between items-center z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <BrandLogo />
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative">
          <Bell size={20} className="text-white/60" />
          <div className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${mode === 'driver' ? 'bg-purple-500' : 'bg-cyan-400'}`} />
        </div>
      </header>

      <main className="h-full">
        {activeTab === 'profile' ? (
          <ProfileScreen mode={mode} setMode={setMode} />
        ) : (
          mode === 'driver' ? <LentaScreen /> : <SenderDashboard 
            orders={orders} 
            loading={loading} 
            onRefresh={loadOrders}
            onShowOffers={setSelectedOrder} 
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-[60] px-6 pb-10 pt-4 bg-gradient-to-t from-black to-transparent">
        <div className="bg-[#121421]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2 flex items-center justify-between shadow-2xl">
          {navigation.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center flex-1 py-2 transition-all ${activeTab === tab.id ? (mode === 'driver' ? 'text-purple-400 scale-110' : 'text-cyan-400 scale-110') : 'text-white/20'}`}>
              <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              <span className="text-[8px] font-black mt-1 uppercase">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <OffersDetailsModal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        selectedOrder={selectedOrder} 
        onAcceptSuccess={loadOrders}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; background: #050610; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-in { animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .zoom-in { animation: zoomIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
