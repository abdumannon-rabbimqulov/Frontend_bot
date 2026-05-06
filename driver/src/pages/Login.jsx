import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/api';
import { setDriverSession, clearDriverSession } from '../lib/auth';

export default function DriverLogin() {
  const nav = useNavigate();
  const [status, setStatus] = useState('Telegram orqali kirish...');
  const [error, setError] = useState('');

  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    tg?.ready?.();
    tg?.expand?.();

    const initData = tg?.initData;

    if (!initData) {
      setStatus('Telegram WebApp ochilmagan. Bot ichidan oching.');
      return;
    }

    async function doLogin() {
      try {
        setStatus('Kirish tekshirilmoqda...');
        const res = await auth.loginWithTelegram(initData);

        // Special case: driver has no profile yet
        if (res.status === 'need_driver_profile') {
          setDriverSession(res);
          setStatus('Profil ma\'lumotlaringizni to\'ldiring');
          // Redirect to profile form
          nav('/profile', { replace: true, state: { needProfile: true } });
          return;
        }

        // Normal login
        if (res.role !== 'driver') {
          setError('Siz haydovchi emassiz. Admin paneldan foydalaning.');
          return;
        }

        setDriverSession(res);
        nav('/dashboard', { replace: true });
      } catch (e) {
        setError(e.message || 'Kirishda xatolik yuz berdi');
        clearDriverSession();
      }
    }

    doLogin();
  }, [nav]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="text-3xl font-bold text-primary">LA</span>
        </div>
        <h1 className="text-3xl font-bold">Logistika AI — Haydovchi</h1>
        <p className="mt-3 text-muted">Telegram orqali avtorizatsiya qilinmoqda</p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-card p-6">
          {error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <div className="text-sm text-muted">{status}</div>
          )}
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 text-xs text-muted hover:text-white"
        >
          Qayta urinish
        </button>
      </div>
    </div>
  );
}
