import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, LogIn, Loader2 } from 'lucide-react';

import LangSwitcher from '../components/LangSwitcher.jsx';
import { auth } from '../lib/api.js';
import { setToken, setUser, isAdmin } from '../lib/auth.js';

export default function Login() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const loc = useLocation();
  const [state, setState] = useState({ status: 'idle', error: '' });

  const tryLogin = async () => {
    const tg = window.Telegram?.WebApp;
    if (!tg || !tg.initData) {
      setState({ status: 'no_telegram', error: t('auth.noTelegram') });
      return;
    }
    setState({ status: 'loading', error: '' });
    try {
      const data = await auth.loginWithTelegram(tg.initData);
      setToken(data.access_token);
      const me = await auth.me();
      setUser(me);
      if (!isAdmin(me)) {
        setState({ status: 'forbidden', error: t('auth.notAdmin') });
        return;
      }
      const target = loc.state?.from || '/';
      nav(target, { replace: true });
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
    if (tg?.initData) {
      tryLogin();
    } else {
      setState({ status: 'no_telegram', error: '' });
    }
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
          <p className="mt-2 text-sm text-muted">{t('auth.subtitle')}</p>

          <div className="mt-6">
            {state.status === 'loading' && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted">
                <Loader2 size={16} className="animate-spin" /> {t('auth.loggingIn')}
              </div>
            )}

            {(state.status === 'no_telegram' || state.status === 'forbidden' || state.status === 'error') && (
              <>
                {state.error && (
                  <p className="mb-3 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                    {state.error}
                  </p>
                )}
                <a
                  href="https://t.me/Logistika_AIbot"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full"
                >
                  <LogIn size={16} /> {t('auth.openInTelegram')}
                </a>
                {window.Telegram?.WebApp?.initData && (
                  <button onClick={tryLogin} className="btn-outline mt-3 w-full">
                    {t('auth.tryAgain')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
