import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  Package,
  Bot,
  MapPin,
  Truck,
  Wallet,
} from 'lucide-react';
import { getUser } from '../lib/auth.js';

const ITEMS = [
  { to: '/', key: 'dashboard', icon: LayoutDashboard, end: true },
  { to: '/users', key: 'users', icon: Users },
  { to: '/orders', key: 'orders', icon: Package },
  { to: '/live', key: 'live', icon: MapPin },
  { to: '/ai-logs', key: 'aiLogs', icon: Bot },
  { to: '/truck-types', key: 'truckTypes', icon: Truck },
  { to: '/tariffs', key: 'tariffs', icon: Wallet },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const user = getUser();

  return (
    <aside className="panel panel-pad sticky top-4 flex h-[calc(100vh-2rem)] w-[260px] flex-col">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <LayoutDashboard size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-5">
            Logistika <span className="text-primary">AI</span>
          </h1>
          <p className="text-[11px] text-muted">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        {ITEMS.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-primary/15 text-white border border-primary/30'
                  : 'text-muted hover:bg-white/5 hover:text-white border border-transparent',
              ].join(' ')
            }
          >
            <it.icon size={16} />
            {t(`nav.${it.key}`)}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-400 text-bg font-bold">
            {(user?.full_name || 'A')[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-semibold">{user?.full_name || 'Admin'}</p>
            <p className="truncate text-[11px] text-muted">{t('header.superAdmin')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
