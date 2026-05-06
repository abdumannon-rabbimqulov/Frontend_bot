import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Sidebar from './Sidebar.jsx';
import LangSwitcher from './LangSwitcher.jsx';
import { auth } from '../lib/api.js';
import { logout } from '../lib/auth.js';

export default function AdminLayout() {
  const { t } = useTranslation();
  const nav = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch {
      // Token allaqachon yaroqsiz bo'lsa ham local sessiyani yopamiz.
    } finally {
      logout();
      localStorage.setItem('logistika_logged_out', '1');
      window.location.replace('/');
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 top-1/2 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[140px]" />

      <div className="relative mx-auto flex max-w-[1480px] gap-4 px-4 py-4 lg:px-6">
        <Sidebar />

        <main className="flex-1">
          <header className="mb-4 flex items-center justify-end gap-3">
            <LangSwitcher />
            <button onClick={handleLogout} className="btn-outline">
              <LogOut size={14} /> {t('header.logout')}
            </button>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
