import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/api';
import { setDriverSession, clearDriverSession } from '../lib/auth';

function apiErrorMessage(e) {
  const d = e?.response?.data?.detail;
  if (typeof d === 'string') return d;
  if (Array.isArray(d)) return d.map((x) => x.msg || JSON.stringify(x)).join(', ');
  return e?.message || 'Kirishda xatolik yuz berdi';
}

function redirectByRole(res, nav) {
  const role = String(res?.role || '').toLowerCase();
  if (role === 'driver') {
    nav('/dashboard', { replace: true });
    return;
  }
  if (role === 'admin') {
    window.location.replace('/admin/');
    return;
  }
  if (role === 'sender') {
    window.location.replace('/sender/');
    return;
  }
  window.location.replace('/');
}

export default function DriverLogin() {
  const nav = useNavigate();
  const tg = window.Telegram?.WebApp;
  const hasTg = Boolean(tg?.initData);

  const [status, setStatus] = useState(hasTg ? 'Telegram orqali kirish...' : '');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPhone, setShowPhone] = useState(!hasTg);
  const [phoneForm, setPhoneForm] = useState({ phone_number: '', password: '' });
  const [phoneLoading, setPhoneLoading] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState('phone');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotPass, setForgotPass] = useState({ new_password: '', confirm_password: '' });
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    tg?.ready?.();
    tg?.expand?.();

    const initData = tg?.initData;
    if (!initData) {
      setStatus('');
      return;
    }

    async function doLogin() {
      try {
        setStatus('Kirish tekshirilmoqda...');
        const res = await auth.loginWithTelegram(initData);

        if (res.status === 'need_driver_profile') {
          setDriverSession(res);
          setStatus("Profil ma'lumotlaringizni to'ldiring");
          nav('/profile', { replace: true, state: { needProfile: true } });
          return;
        }

        if (res?.access_token) {
          setDriverSession(res);
        }
        redirectByRole(res, nav);
      } catch (e) {
        setError(apiErrorMessage(e));
        clearDriverSession();
      }
    }

    doLogin();
  }, [nav, tg?.initData]);

  const submitPhoneLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setPhoneLoading(true);
    try {
      const res = await auth.loginWithPhone(phoneForm.phone_number.trim(), phoneForm.password);
      if (res?.access_token) {
        setDriverSession(res);
      }
      redirectByRole(res, nav);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setPhoneLoading(false);
    }
  };

  const resetForgotUi = () => {
    setForgotOpen(false);
    setForgotStep('phone');
    setForgotPhone('');
    setForgotCode('');
    setForgotPass({ new_password: '', confirm_password: '' });
    setForgotMsg('');
    clearDriverSession();
  };

  const submitForgotPhone = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    setForgotLoading(true);
    try {
      clearDriverSession();
      const data = await auth.requestPasswordReset(forgotPhone.trim());
      if (data.access_token) {
        setDriverSession({
          access_token: data.access_token,
          refresh_token: '',
          role: null,
          user_id: null,
        });
      }
      setForgotMsg(data.detail || "Kod Telegramga yuborildi.");
      setForgotStep('code');
    } catch (err) {
      setForgotMsg(apiErrorMessage(err));
    } finally {
      setForgotLoading(false);
    }
  };

  const submitForgotCode = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    setForgotLoading(true);
    try {
      const data = await auth.verifyPasswordResetCode(forgotCode.trim());
      setForgotMsg(data.detail || 'Kod tasdiqlandi.');
      setForgotStep('password');
    } catch (err) {
      setForgotMsg(apiErrorMessage(err));
    } finally {
      setForgotLoading(false);
    }
  };

  const submitForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    if (forgotPass.new_password !== forgotPass.confirm_password) {
      setForgotMsg("Parollar mos kelmaydi.");
      return;
    }
    if (forgotPass.new_password.length < 8 || forgotPass.new_password.length > 20) {
      setForgotMsg('Parol 8–20 belgi orasida bo‘lishi kerak.');
      return;
    }
    setForgotLoading(true);
    try {
      const data = await auth.completePasswordReset(
        forgotPass.new_password,
        forgotPass.confirm_password,
      );
      const msg = data.detail || "Parol yangilandi. Telefon va yangi parol bilan kiring.";
      clearDriverSession();
      setForgotOpen(false);
      setForgotStep('phone');
      setForgotPhone('');
      setForgotCode('');
      setForgotPass({ new_password: '', confirm_password: '' });
      setForgotMsg('');
      setShowPhone(true);
      setError('');
      setSuccessMsg(msg);
    } catch (err) {
      setForgotMsg(apiErrorMessage(err));
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="text-3xl font-bold text-primary">LA</span>
        </div>
        <h1 className="text-3xl font-bold">Logistika AI — Haydovchi</h1>
        <p className="mt-3 text-muted">
          {hasTg ? 'Telegram orqali avtorizatsiya qilinmoqda' : 'Telefon raqam va parol bilan kiring'}
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-card p-6 space-y-4">
          {successMsg ? <div className="text-emerald-400 text-sm">{successMsg}</div> : null}
          {error ? <div className="text-danger text-sm">{error}</div> : null}
          {hasTg && !error ? <div className="text-sm text-muted">{status}</div> : null}

          {!hasTg && (
            <p className="text-sm text-muted">
              Ilova faqat Telegram ichida to‘liq ishlaydi. Pastda telefon orqali ham kirish mumkin.
            </p>
          )}

          {hasTg ? (
            <button
              type="button"
              onClick={() => setShowPhone((v) => !v)}
              className="text-xs text-muted hover:text-white underline"
            >
              {showPhone ? 'Telefon formasini yashirish' : 'Telefon raqam orqali kirish'}
            </button>
          ) : null}

          {(showPhone || !hasTg) && !forgotOpen && (
            <form onSubmit={submitPhoneLogin} className="space-y-3 text-left">
              <div>
                <label className="block text-xs text-muted mb-1">Telefon raqam</label>
                <input
                  className="w-full rounded-xl border border-white/10 bg-bg px-3 py-2 text-sm"
                  value={phoneForm.phone_number}
                  onChange={(ev) => setPhoneForm((f) => ({ ...f, phone_number: ev.target.value }))}
                  autoComplete="tel"
                  placeholder="+998..."
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Parol</label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-white/10 bg-bg px-3 py-2 text-sm"
                  value={phoneForm.password}
                  onChange={(ev) => setPhoneForm((f) => ({ ...f, password: ev.target.value }))}
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                disabled={phoneLoading}
                className="w-full rounded-xl bg-primary py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {phoneLoading ? 'Kutilmoqda...' : 'Kirish'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForgotOpen(true);
                  setForgotStep('phone');
                  setForgotMsg('');
                }}
                className="w-full text-xs text-muted hover:text-white"
              >
                Parolni unutdingizmi?
              </button>
            </form>
          )}

          {forgotOpen && (
            <div className="text-left space-y-3 border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Parolni tiklash</span>
                <button
                  type="button"
                  onClick={resetForgotUi}
                  className="text-xs text-muted hover:text-white"
                >
                  Bekor qilish
                </button>
              </div>
              {forgotMsg ? <div className="text-xs text-muted">{forgotMsg}</div> : null}

              {forgotStep === 'phone' && (
                <form onSubmit={submitForgotPhone} className="space-y-2">
                  <input
                    className="w-full rounded-xl border border-white/10 bg-bg px-3 py-2 text-sm"
                    value={forgotPhone}
                    onChange={(ev) => setForgotPhone(ev.target.value)}
                    placeholder="Hisobdagi telefon raqam"
                    autoComplete="tel"
                  />
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full rounded-xl border border-white/20 py-2 text-sm disabled:opacity-50"
                  >
                    {forgotLoading ? '...' : 'Kod yuborish (Telegram)'}
                  </button>
                </form>
              )}

              {forgotStep === 'code' && (
                <form onSubmit={submitForgotCode} className="space-y-2">
                  <input
                    className="w-full rounded-xl border border-white/10 bg-bg px-3 py-2 text-sm"
                    value={forgotCode}
                    onChange={(ev) => setForgotCode(ev.target.value)}
                    placeholder="Telegramdagi kod"
                    autoComplete="one-time-code"
                  />
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full rounded-xl border border-white/20 py-2 text-sm disabled:opacity-50"
                  >
                    {forgotLoading ? '...' : 'Kodni tasdiqlash'}
                  </button>
                </form>
              )}

              {forgotStep === 'password' && (
                <form onSubmit={submitForgotPassword} className="space-y-2">
                  <input
                    type="password"
                    className="w-full rounded-xl border border-white/10 bg-bg px-3 py-2 text-sm"
                    value={forgotPass.new_password}
                    onChange={(ev) =>
                      setForgotPass((f) => ({ ...f, new_password: ev.target.value }))
                    }
                    placeholder="Yangi parol (8–20 belgi)"
                    autoComplete="new-password"
                  />
                  <input
                    type="password"
                    className="w-full rounded-xl border border-white/10 bg-bg px-3 py-2 text-sm"
                    value={forgotPass.confirm_password}
                    onChange={(ev) =>
                      setForgotPass((f) => ({ ...f, confirm_password: ev.target.value }))
                    }
                    placeholder="Parolni tasdiqlang"
                    autoComplete="new-password"
                  />
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full rounded-xl bg-primary py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {forgotLoading ? '...' : 'Parolni saqlash'}
                  </button>
                </form>
              )}
            </div>
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
