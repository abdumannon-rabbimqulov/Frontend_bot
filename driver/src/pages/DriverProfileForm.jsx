import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, LoaderCircle, Save, ShieldCheck, Truck } from 'lucide-react';
import { driverProfile, truckTypes } from '../lib/api';
import DriverLayout from '../components/DriverLayout';

export default function DriverProfileForm() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    truck_type_id: '',
    truck_number: '',
    truck_year: '',
    current_city: '',
    current_region: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState({});

  const { data: types = [], isLoading: typesLoading } = useQuery({
    queryKey: ['truckTypes'],
    queryFn: truckTypes.list,
  });
  const { data: existingProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['driverMe'],
    queryFn: driverProfile.me,
  });

  const isEditMode = !!existingProfile?.id;

  useEffect(() => {
    if (!existingProfile?.id) return;
    setForm((prev) => ({
      ...prev,
      truck_type_id: String(existingProfile.truck_type_id || ''),
      truck_number: existingProfile.truck_number || '',
      truck_year: existingProfile.truck_year ? String(existingProfile.truck_year) : '',
      current_city: existingProfile.current_city || '',
      current_region: existingProfile.current_region || '',
      phone_number: existingProfile.phone_number || prev.phone_number || '',
    }));
  }, [existingProfile]);

  const validationErrors = useMemo(() => {
    const errs = {};
    if (!form.truck_type_id) errs.truck_type_id = 'Mashina turini tanlang';
    if (!/^[0-9A-Z]{6,10}$/.test(String(form.truck_number || '').replace(/\s/g, '').toUpperCase())) {
      errs.truck_number = "Davlat raqami noto'g'ri (masalan: 60A123BC)";
    }
    if (!form.current_city || form.current_city.trim().length < 2) {
      errs.current_city = 'Shahar nomini kiriting';
    }
    if (form.truck_year) {
      const y = Number(form.truck_year);
      const current = new Date().getFullYear() + 1;
      if (Number.isNaN(y) || y < 1980 || y > current) {
        errs.truck_year = `Yil 1980-${current} oralig'ida bo'lishi kerak`;
      }
    }
    if (form.phone_number && !/^\+?\d{9,15}$/.test(form.phone_number.replace(/\s/g, ''))) {
      errs.phone_number = "Telefon formati noto'g'ri";
    }
    return errs;
  }, [form]);

  const submitMutation = useMutation({
    mutationFn: async (payload) => {
      if (isEditMode) return driverProfile.update(payload);
      return driverProfile.create(payload);
    },
    onSuccess: () => {
      localStorage.setItem('driver_profile_completed', '1');
      qc.invalidateQueries({ queryKey: ['driverMe'] });
      setSuccess("Profil muvaffaqiyatli saqlandi");
      setError('');
      setTimeout(() => nav('/dashboard', { replace: true }), 500);
    },
    onError: (err) => {
      setError(err?.response?.data?.detail || 'Profil saqlanmadi');
      setSuccess('');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      truck_type_id: true,
      truck_number: true,
      truck_year: true,
      current_city: true,
      current_region: true,
      phone_number: true,
    });
    if (Object.keys(validationErrors).length > 0) return;
    try {
      const payload = {
        ...form,
        truck_type_id: Number(form.truck_type_id),
        truck_year: form.truck_year ? Number(form.truck_year) : null,
        truck_number: String(form.truck_number).replace(/\s/g, '').toUpperCase(),
        current_city: form.current_city.trim(),
        current_region: form.current_region?.trim() || null,
        phone_number: form.phone_number?.trim() || null,
      };
      await submitMutation.mutateAsync(payload);
    } catch {
      // handled in mutation callback
    }
  };

  const fieldError = (name) => (touched[name] ? validationErrors[name] : '');

  const onChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  return (
    <DriverLayout>
      <div className="px-4 pt-4 pb-4">
        <div className="panel p-4">
          <button onClick={() => nav('/dashboard')} className="mb-3 inline-flex items-center gap-1 text-xs text-muted">
            <ArrowLeft size={14} />
            Dashboardga qaytish
          </button>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">Haydovchi profili</h1>
              <p className="text-muted mt-1 text-sm">
                {isEditMode ? "Profil ma'lumotlarini yangilang" : "Ishni boshlash uchun profilingizni to'ldiring"}
              </p>
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              {isEditMode ? "Faol profil" : "Yangi profil"}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mt-3">
          <div className="panel p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Truck size={16} className="text-primary" />
              Transport ma'lumotlari
            </div>

            <label className="mb-1 block text-xs text-muted">Mashina turi</label>
            <select
              className="input w-full"
              value={form.truck_type_id}
              onChange={(e) => onChange('truck_type_id', e.target.value)}
              disabled={typesLoading || profileLoading}
              required
            >
              <option value="">{typesLoading ? 'Yuklanmoqda...' : 'Tanlang...'}</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {fieldError('truck_type_id') && <div className="mt-1 text-xs text-danger">{fieldError('truck_type_id')}</div>}

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="mb-1 block text-xs text-muted">Davlat raqami</label>
                <input
                  className="input w-full uppercase"
                  placeholder="60A123BC"
                  value={form.truck_number}
                  onChange={(e) => onChange('truck_number', e.target.value.toUpperCase())}
                  required
                />
                {fieldError('truck_number') && <div className="mt-1 text-xs text-danger">{fieldError('truck_number')}</div>}
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted">Ishlab chiqarilgan yil</label>
                <input
                  type="number"
                  className="input w-full"
                  placeholder="2020"
                  value={form.truck_year}
                  onChange={(e) => onChange('truck_year', e.target.value)}
                />
                {fieldError('truck_year') && <div className="mt-1 text-xs text-danger">{fieldError('truck_year')}</div>}
              </div>
            </div>
          </div>

          <div className="panel p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck size={16} className="text-success" />
              Joylashuv va aloqa
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Hozirgi shahar</label>
              <input
                className="input w-full"
                value={form.current_city}
                onChange={(e) => onChange('current_city', e.target.value)}
                required
              />
              {fieldError('current_city') && <div className="mt-1 text-xs text-danger">{fieldError('current_city')}</div>}
            </div>

            <div className="mt-3">
              <label className="mb-1 block text-xs text-muted">Viloyat</label>
              <input
                className="input w-full"
                placeholder="Toshkent viloyati"
                value={form.current_region}
                onChange={(e) => onChange('current_region', e.target.value)}
              />
            </div>

            <div className="mt-3">
              <label className="mb-1 block text-xs text-muted">Telefon raqam</label>
              <input
                className="input w-full"
                placeholder="+998901234567"
                value={form.phone_number}
                onChange={(e) => onChange('phone_number', e.target.value)}
              />
              {fieldError('phone_number') && <div className="mt-1 text-xs text-danger">{fieldError('phone_number')}</div>}
            </div>
          </div>

          {error && <div className="text-sm text-danger">{error}</div>}
          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
              <CheckCircle2 size={16} />
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitMutation.isPending || profileLoading}
            className="btn-primary w-full py-3 text-base inline-flex items-center justify-center gap-2"
          >
            {submitMutation.isPending ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Saqlanmoqda...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEditMode ? "O'zgarishlarni saqlash" : "Profilni yaratish"}
              </>
            )}
          </button>
        </form>
      </div>
    </DriverLayout>
  );
}
