import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { driverProfile, truckTypes } from '../lib/api';
import { getDriverUser } from '../lib/auth';

export default function DriverProfileForm() {
  const nav = useNavigate();
  const user = getDriverUser();
  const [form, setForm] = useState({
    truck_type_id: '',
    truck_number: '',
    truck_year: '',
    current_city: '',
    current_region: '',
    phone_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: types = [] } = useQuery({
    queryKey: ['truckTypes'],
    queryFn: truckTypes.list,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await driverProfile.create({
        ...form,
        truck_type_id: Number(form.truck_type_id),
        truck_year: form.truck_year ? Number(form.truck_year) : null,
      });
      localStorage.setItem('driver_profile_completed', '1');
      nav('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Profil saqlanmadi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg p-4">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Haydovchi profili</h1>
          <p className="text-muted mt-1 text-sm">
            Iltimos, ma'lumotlaringizni to'ldiring
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-muted">Mashina turi</label>
            <select
              className="input w-full"
              value={form.truck_type_id}
              onChange={(e) => setForm({ ...form, truck_type_id: e.target.value })}
              required
            >
              <option value="">Tanlang...</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted">Davlat raqami</label>
              <input
                className="input w-full"
                placeholder="60A123BC"
                value={form.truck_number}
                onChange={(e) => setForm({ ...form, truck_number: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Ishlab chiqarilgan yil</label>
              <input
                type="number"
                className="input w-full"
                placeholder="2020"
                value={form.truck_year}
                onChange={(e) => setForm({ ...form, truck_year: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted">Hozirgi shahar</label>
              <input
                className="input w-full"
                value={form.current_city}
                onChange={(e) => setForm({ ...form, current_city: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Viloyat</label>
              <input
                className="input w-full"
                value={form.current_region}
                onChange={(e) => setForm({ ...form, current_region: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Telefon raqam (ixtiyoriy)</label>
            <input
              className="input w-full"
              placeholder="+998901234567"
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            />
          </div>

          {error && <div className="text-sm text-danger">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base"
          >
            {loading ? 'Saqlanmoqda...' : 'Profilni saqlash'}
          </button>
        </form>
      </div>
    </div>
  );
}
