import { Home, Package, Truck, MessageCircle, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', label: 'Bosh sahifa', icon: Home },
  { path: '/loads', label: 'Yuklar', icon: Package },
  { path: '/active', label: 'Rejs', icon: Truck },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/profile', label: 'Profil', icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const nav = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => nav(item.path)}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-xs transition ${active ? 'text-primary' : 'text-muted hover:text-white'}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
