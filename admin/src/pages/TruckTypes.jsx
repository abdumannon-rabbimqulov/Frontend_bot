import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Modal from '../components/Modal.jsx';
import { truckTypes } from '../lib/api.js';

const empty = {
  name: '',
  max_weight: '',
  max_volume: '',
  length: '',
  width: '',
  height: '',
  pallet_capacity: '',
  image_url: '',
  description: '',
  is_active: true,
};

export default function TruckTypes() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const q = useQuery({ queryKey: ['truckTypes'], queryFn: truckTypes.list });

  const mut = useMutation({
    mutationFn: ({ id, data }) =>
      id ? truckTypes.update(id, data) : truckTypes.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['truckTypes'] });
      setEditing(null);
      setForm(empty);
    },
  });

  const remove = useMutation({
    mutationFn: (id) => truckTypes.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['truckTypes'] }),
  });

  const items = q.data || [];

  const columns = [
    { key: 'id', title: 'ID', render: (r) => <span className="text-muted">#{r.id}</span> },
    { key: 'name', title: t('truckTypes.name'), render: (r) => <span className="font-medium text-white">{r.name}</span> },
    { key: 'weight', title: t('truckTypes.weight'), render: (r) => r.max_weight },
    { key: 'volume', title: t('truckTypes.volume'), render: (r) => r.max_volume },
    {
      key: 'active',
      title: t('truckTypes.active'),
      render: (r) =>
        r.is_active ? (
          <StatusBadge status="active" label={t('users.status.active')} />
        ) : (
          <StatusBadge status="inactive" label={t('users.status.inactive')} />
        ),
    },
    {
      key: 'actions',
      title: t('common.actions'),
      cellClass: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => {
              setEditing(r);
              setForm({
                name: r.name,
                max_weight: r.max_weight,
                max_volume: r.max_volume,
                length: r.length || '',
                width: r.width || '',
                height: r.height || '',
                pallet_capacity: r.pallet_capacity || '',
                image_url: r.image_url || '',
                description: r.description || '',
                is_active: r.is_active,
              });
            }}
            className="rounded-lg border border-white/10 p-1.5 hover:bg-white/5"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`${r.name} — ${t('truckTypes.delete')}?`)) remove.mutate(r.id);
            }}
            className="rounded-lg border border-danger/20 p-1.5 text-danger hover:bg-danger/10"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      max_weight: Number(form.max_weight),
      max_volume: Number(form.max_volume),
      length: form.length === '' ? null : Number(form.length),
      width: form.width === '' ? null : Number(form.width),
      height: form.height === '' ? null : Number(form.height),
      pallet_capacity: form.pallet_capacity === '' ? null : Number(form.pallet_capacity),
      image_url: form.image_url || null,
      description: form.description || null,
    };
    mut.mutate({ id: editing?.id, data: payload });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('truckTypes.title')}</h2>
        <button
          onClick={() => {
            setEditing({});
            setForm(empty);
          }}
          className="btn-primary"
        >
          <Plus size={14} /> {t('truckTypes.create')}
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={items.map((r) => ({ ...r, __key: r.id }))}
        isLoading={q.isLoading}
      />

      <Modal
        open={!!editing}
        onClose={() => {
          setEditing(null);
          setForm(empty);
        }}
        title={editing?.id ? t('truckTypes.edit') : t('truckTypes.create')}
        footer={
          <>
            <button
              className="btn-outline"
              onClick={() => {
                setEditing(null);
                setForm(empty);
              }}
            >
              {t('common.cancel')}
            </button>
            <button className="btn-primary" onClick={submit}>
              {t('common.save')}
            </button>
          </>
        }
      >
        <form onSubmit={submit} className="space-y-3 text-sm">
          <Field label={t('truckTypes.name')}>
            <input className="input w-full" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label={t('truckTypes.weight')}>
              <input
                type="number"
                step="0.01"
                className="input w-full"
                value={form.max_weight}
                onChange={(e) => setForm((f) => ({ ...f, max_weight: e.target.value }))}
                required
              />
            </Field>
            <Field label={t('truckTypes.volume')}>
              <input
                type="number"
                step="0.01"
                className="input w-full"
                value={form.max_volume}
                onChange={(e) => setForm((f) => ({ ...f, max_volume: e.target.value }))}
                required
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Length (m)">
              <input
                type="number"
                step="0.01"
                className="input w-full"
                value={form.length}
                onChange={(e) => setForm((f) => ({ ...f, length: e.target.value }))}
              />
            </Field>
            <Field label="Width (m)">
              <input
                type="number"
                step="0.01"
                className="input w-full"
                value={form.width}
                onChange={(e) => setForm((f) => ({ ...f, width: e.target.value }))}
              />
            </Field>
            <Field label="Height (m)">
              <input
                type="number"
                step="0.01"
                className="input w-full"
                value={form.height}
                onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Pallet capacity">
              <input
                type="number"
                className="input w-full"
                value={form.pallet_capacity}
                onChange={(e) => setForm((f) => ({ ...f, pallet_capacity: e.target.value }))}
              />
            </Field>
            <Field label="Image URL">
              <input
                className="input w-full"
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              className="input w-full"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </Field>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            />
            <span>{t('truckTypes.active')}</span>
          </label>
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
