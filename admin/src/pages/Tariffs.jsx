import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';

import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import { tariffs } from '../lib/api.js';

const emptyForm = {
  user_id: '',
  billing_year: new Date().getFullYear(),
  billing_month: new Date().getMonth() + 1,
  amount: '',
  currency: 'UZS',
  tariff_code: '',
  note: '',
};

export default function Tariffs() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [userId, setUserId] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const list = useQuery({
    queryKey: ['tariffs', userId, year],
    queryFn: () => (userId ? tariffs.listForUser(userId, year) : tariffs.listAll({ skip: 0, limit: 100 })),
  });
  const summary = useQuery({
    queryKey: ['tariffsSummary', userId, year],
    queryFn: () => tariffs.summary(userId, year),
    enabled: !!userId,
  });

  const create = useMutation({
    mutationFn: (data) => tariffs.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tariffs'] });
      qc.invalidateQueries({ queryKey: ['tariffsSummary'] });
      setShowCreate(false);
      setForm(emptyForm);
    },
  });

  const remove = useMutation({
    mutationFn: (id) => tariffs.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tariffs'] }),
  });

  const items = list.data || [];
  const summaryRows = summary.data || [];

  const columns = [
    { key: 'id', title: 'ID', render: (r) => <span className="text-muted">#{r.id}</span> },
    { key: 'user', title: t('tariffs.userId'), render: (r) => `#${r.user_id}` },
    {
      key: 'month',
      title: t('tariffs.month'),
      render: (r) => r.billing_month?.slice(0, 7),
    },
    {
      key: 'amount',
      title: t('tariffs.amount'),
      render: (r) => `${Number(r.amount).toLocaleString('uz-UZ')} ${r.currency}`,
    },
    { key: 'code', title: t('tariffs.code'), render: (r) => r.tariff_code || '—' },
    { key: 'note', title: t('tariffs.note'), render: (r) => r.note || '—' },
    {
      key: 'actions',
      title: t('common.actions'),
      cellClass: 'text-right',
      render: (r) => (
        <button
          onClick={() => {
            if (window.confirm(`#${r.id} — ${t('users.actions.deactivate')}?`)) remove.mutate(r.id);
          }}
          className="rounded-lg border border-danger/20 p-1.5 text-danger hover:bg-danger/10"
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  const submit = (e) => {
    e.preventDefault();
    create.mutate({
      ...form,
      user_id: Number(form.user_id),
      billing_year: Number(form.billing_year),
      billing_month: Number(form.billing_month),
      amount: Number(form.amount),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('tariffs.title')}</h2>
        <button
          onClick={() => {
            setShowCreate(true);
            setForm({ ...emptyForm, user_id: userId || '' });
          }}
          className="btn-primary"
        >
          <Plus size={14} /> {t('tariffs.create')}
        </button>
      </div>

      <div className="panel panel-pad flex flex-wrap items-end gap-3">
        <Field label={t('tariffs.userId')}>
          <input
            className="input"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="123456"
          />
        </Field>
        <Field label={t('tariffs.year')}>
          <input
            type="number"
            className="input w-28"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </Field>
        <button onClick={() => list.refetch()} className="btn-outline">
          {t('tariffs.loadList')}
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={items.map((r) => ({ ...r, __key: r.id }))}
        isLoading={list.isLoading}
      />

      {userId && (
        <div className="panel panel-pad">
          <h3 className="mb-3 text-sm font-semibold text-muted">{t('tariffs.summary')}</h3>
          {summary.isLoading ? (
            <div className="text-sm text-muted">{t('common.loading')}</div>
          ) : summaryRows.length ? (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {summaryRows.map((row) => (
                <div key={row.billing_month} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs text-muted">{row.billing_month?.slice(0, 7)}</p>
                  <p className="text-lg font-bold text-white">
                    {Number(row.total_amount).toLocaleString('uz-UZ')} {row.currency}
                  </p>
                  <p className="text-[11px] text-muted">
                    {t('tariffs.monthCount')}: {row.payment_count}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">{t('common.noData')}</p>
          )}
        </div>
      )}

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title={t('tariffs.create')}
        footer={
          <>
            <button className="btn-outline" onClick={() => setShowCreate(false)}>
              {t('common.cancel')}
            </button>
            <button className="btn-primary" onClick={submit}>
              {t('common.save')}
            </button>
          </>
        }
      >
        <form className="space-y-3 text-sm" onSubmit={submit}>
          <Field label={t('tariffs.userId')}>
            <input className="input w-full" required value={form.user_id} onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label={t('tariffs.year')}>
              <input
                type="number"
                className="input w-full"
                value={form.billing_year}
                onChange={(e) => setForm((f) => ({ ...f, billing_year: e.target.value }))}
                required
              />
            </Field>
            <Field label={t('tariffs.month')}>
              <input
                type="number"
                min="1"
                max="12"
                className="input w-full"
                value={form.billing_month}
                onChange={(e) => setForm((f) => ({ ...f, billing_month: e.target.value }))}
                required
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label={t('tariffs.amount')}>
              <input
                type="number"
                step="0.01"
                className="input w-full"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                required
              />
            </Field>
            <Field label={t('tariffs.currency')}>
              <input className="input w-full" value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} />
            </Field>
          </div>
          <Field label={t('tariffs.code')}>
            <input className="input w-full" value={form.tariff_code} onChange={(e) => setForm((f) => ({ ...f, tariff_code: e.target.value }))} />
          </Field>
          <Field label={t('tariffs.note')}>
            <textarea className="input w-full" rows={2} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} />
          </Field>
        </form>
      </Modal>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      {children}
    </label>
  );
}
