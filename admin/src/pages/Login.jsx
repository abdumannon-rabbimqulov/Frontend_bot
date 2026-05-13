import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, LogIn, Loader2 } from 'lucide-react';

import LangSwitcher from '../components/LangSwitcher.jsx';
import { auth } from '../lib/api.js';
import { setRefreshToken, setToken, setUser } from '../lib/auth.js';

export default function Login() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const loc = useLocation();
  const [state, setState] = useState({ status: 'idle', error: '' });
  const [form, setForm] = useState({ phone_number: '', password: '' });

  const redirectByRole = (role) => {
    const normalized = String(role || '').toLowerCase();
    if (normalized === 'admin') {
      const target = loc.state?.from || '/';
      nav(target, { replace: true });
      return;
    }
    if (normalized === 'driver') {
      window.location.replace('/drivers/dashboard');
      return;
    }
    if (normalized === 'sender') {
      window.location.replace('/sender/');
      return;
    }
    window.location.replace('/');
  };

  const persistSessionByRole = (data, me = null) => {
    const role = String(data?.role || me?.role || '').toLowerCase();
    localStorage.removeItem('logistika_logged_out');
    if (role === 'admin') {
      setToken(data.access_token);
      setRefreshToken(data.refresh_token);
      if (me) setUser(me);
      return;
    }
    if (role === 'driver') {
      localStorage.setItem('driver_access_token', data.access_token || '');
      if (data.refresh_token) localStorage.setItem('driver_refresh_token', data.refresh_token);
      localStorage.setItem('driver_user', JSON.stringify({ ...(me || {}), ...(data || {}) }));
      return;
    }
    if (role === 'sender') {
      localStorage.setItem('sender_access_token', data.access_token || '');
      if (data.refresh_token) localStorage.setItem('sender_refresh_token', data.refresh_token);
      localStorage.setItem('sender_user', JSON.stringify({ ...(me || {}), ...(data || {}) }));
    }
  };

  const tryLogin = async () => {
    const tg = window.Telegram?.WebApp;
    if (!tg || !tg.initData) {
      setState({ status: 'idle', error: '' });
      return;
    }
    setState({ status: 'loading', error: '' });
    try {
      const data = await auth.loginWithTelegram(tg.initData);
      const role = String(data?.role || '').toLowerCase();
      if (role === 'admin') {
        setToken(data.access_token);
        setRefreshToken(data.refresh_token);
        const me = await auth.me();
        setUser(me);
        redirectByRole('admin');
        return;
      }
      persistSessionByRole(data);
      redirectByRole(role);
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || t('errors.generic');
      setState({ status: 'error', error: msg });
    }
  };

  const tryPhoneLogin = async (e) => {
    e.preventDefault();
    setState({ status: 'loading', error: '' });
    try {
      const data = await auth.loginWithPhone(form.phone_number.trim(), form.password);
      const role = String(data?.role || '').toLowerCase();
      if (role === 'admin') {
        setToken(data.access_token);
        setRefreshToken(data.refresh_token);
        const me = await auth.me();
        setUser(me);
        redirectByRole('admin');
        return;
      }
      persistSessionByRole(data);
      redirectByRole(role);
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || t('errors.generic');
      setState({ status: 'error', error: msg });
    }
  };

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready?.();
      tg.expand?.();
      tg.setHeaderColor?.('#020617');
    }
    if (tg?.initData) tryLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg">
      <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[140px]" />

      <div className="absolute right-4 top-4">
        <LangSwitcher />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4">
        <div className="panel panel-pad w-full text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <ShieldAlert size={28} />
          </div>
          <h1 className="text-2xl font-bold">{t('auth.title')}</h1>
          <p className="mt-2 text-sm text-muted">Telegram yoki telefon raqam va parol bilan kirish mumkin.</p>

          <div className="mt-6">
            {state.status === 'loading' && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted">
                <Loader2 size={16} className="animate-spin" /> {t('auth.loggingIn')}
              </div>
            )}

            {(state.status === 'error') && (
              <>
                {state.error && (
                  <p className="mb-3 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                    {state.error}
                  </p>
                )}
              </>
            )}

            <form onSubmit={tryPhoneLogin} className="mt-2 space-y-3 text-left">
              <div>
                <label className="mb-1 block text-xs text-muted">Telefon raqam</label>
                <input
                  className="input w-full"
                  value={form.phone_number}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone_number: e.target.value }))}
                  placeholder="+998..."
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted">Parol</label>
                <input
                  type="password"
                  className="input w-full"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={state.status === 'loading'}>
                <LogIn size={16} /> Kirish
              </button>
            </form>

            <div className="mt-3">
              <button
                onClick={tryLogin}
                type="button"
                className="btn-outline w-full"
                disabled={state.status === 'loading'}
              >
                {t('auth.openInTelegram')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
