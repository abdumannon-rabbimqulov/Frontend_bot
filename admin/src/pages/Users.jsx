import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Pencil, Ban, ShieldCheck, Trash2 } from 'lucide-react';

import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Modal from '../components/Modal.jsx';
import { users } from '../lib/api.js';

const ROLES = ['admin', 'sender', 'driver', 'guest'];
const LIMIT = 20;

export default function UsersPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ role: '', is_banned: '', is_active: '', search: '' });
  const [editing, setEditing] = useState(null);

  const params = useMemo(() => {
    const p = { skip: page * LIMIT, limit: LIMIT };
    if (filters.role) p.role = filters.role;
    if (filters.is_banned !== '') p.is_banned = filters.is_banned;
    if (filters.is_active !== '') p.is_active = filters.is_active;
    if (filters.search) p.search = filters.search;
    return p;
  }, [page, filters]);

  const q = useQuery({ queryKey: ['admin/users', params], queryFn: () => users.list(params) });

  const update = useMutation({
    mutationFn: ({ id, data }) => users.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin/users'] }),
  });

  const remove = useMutation({
    mutationFn: (id) => users.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin/users'] }),
  });

  const total = q.data?.total ?? 0;
  const items = q.data?.items ?? [];
  const pageCount = Math.max(1, Math.ceil(total / LIMIT));

  const columns = [
    { key: 'id', title: t('users.table.id'), render: (r) => <span className="text-muted">#{r.id}</span> },
    {
      key: 'name',
      title: t('users.table.name'),
      render: (r) => (
        <div className="min-w-0">
          <p className="font-medium text-white">{r.full_name}</p>
          <p className="text-xs text-muted">{r.email || r.username || '—'}</p>
        </div>
      ),
    },
    { key: 'phone', title: t('users.table.phone'), render: (r) => r.phone_number || '—' },
    {
      key: 'role',
      title: t('users.table.role'),
      render: (r) => <span className="badge-info">{r.role || 'guest'}</span>,
    },
    {
      key: 'status',
      title: t('users.table.status'),
      render: (r) => {
        if (r.is_banned) return <StatusBadge status="banned" label={t('users.status.banned')} />;
        if (!r.is_active) return <StatusBadge status="inactive" label={t('users.status.inactive')} />;
        return <StatusBadge status="active" label={t('users.status.active')} />;
      },
    },
    {
      key: 'createdAt',
      title: t('users.table.createdAt'),
      render: (r) => <span className="text-muted">{new Date(r.created_at).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      title: t('common.actions'),
      cellClass: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1.5">
          <button onClick={() => setEditing(r)} className="rounded-lg border border-white/10 p-1.5 hover:bg-white/5" title={t('users.actions.edit')}>
            <Pencil size={14} />
          </button>
          <button
            onClick={() => update.mutate({ id: r.id, data: { is_banned: !r.is_banned } })}
            className="rounded-lg border border-white/10 p-1.5 hover:bg-white/5"
            title={r.is_banned ? t('users.actions.unban') : t('users.actions.ban')}
          >
            {r.is_banned ? <ShieldCheck size={14} className="text-success" /> : <Ban size={14} className="text-danger" />}
          </button>
          <button
            onClick={() => {
              if (window.confirm(`${r.full_name} — ${t('users.actions.deactivate')}?`)) remove.mutate(r.id);
            }}
            className="rounded-lg border border-white/10 p-1.5 hover:bg-white/5"
            title={t('users.actions.deactivate')}
          >
            <Trash2 size={14} className="text-danger" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('users.title')}</h2>

      <div className="panel panel-pad flex flex-wrap items-center gap-3">
        <input
          className="input flex-1 min-w-[220px]"
          placeholder={t('users.filters.search')}
          value={filters.search}
          onChange={(e) => {
            setPage(0);
            setFilters((f) => ({ ...f, search: e.target.value }));
          }}
        />
        <select
          className="input"
          value={filters.role}
          onChange={(e) => {
            setPage(0);
            setFilters((f) => ({ ...f, role: e.target.value }));
          }}
        >
          <option value="">{t('common.all')}</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={filters.is_banned}
          onChange={(e) => {
            setPage(0);
            setFilters((f) => ({ ...f, is_banned: e.target.value }));
          }}
        >
          <option value="">{t('common.all')}</option>
          <option value="false">{t('users.status.active')}</option>
          <option value="true">{t('users.status.banned')}</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={items.map((r) => ({ ...r, __key: r.id }))}
        isLoading={q.isLoading}
        footer={
          <div className="flex items-center justify-between">
            <span>
              {t('common.total')}: <strong className="text-white">{total}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="btn-outline disabled:opacity-50"
              >
                ←
              </button>
              <span>
                {page + 1} / {pageCount}
              </span>
              <button
                disabled={page + 1 >= pageCount}
                onClick={() => setPage((p) => p + 1)}
                className="btn-outline disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        }
      />

      <EditUserModal
        open={!!editing}
        user={editing}
        onClose={() => setEditing(null)}
        onSubmit={(data) => {
          update.mutate({ id: editing.id, data }, { onSuccess: () => setEditing(null) });
        }}
      />
    </div>
  );
}

function EditUserModal({ open, user, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [data, setData] = useState({});

  if (!open) return null;
  const submit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('users.edit.title')}
      footer={
        <>
          <button className="btn-outline" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="btn-primary" onClick={submit}>
            {t('common.save')}
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-3 text-sm">
        <p className="text-muted">
          #{user.id} · {user.full_name}
        </p>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">{t('users.edit.role')}</span>
          <select
            className="input w-full"
            defaultValue={user.role || 'guest'}
            onChange={(e) => setData((d) => ({ ...d, role: e.target.value }))}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">{t('users.edit.language')}</span>
          <select
            className="input w-full"
            defaultValue={user.language}
            onChange={(e) => setData((d) => ({ ...d, language: e.target.value }))}
          >
            <option value="uz">uz</option>
            <option value="uz_cyrl">uz_cyrl</option>
            <option value="ru">ru</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            defaultChecked={!!user.is_active}
            onChange={(e) => setData((d) => ({ ...d, is_active: e.target.checked }))}
          />
          <span className="text-sm">{t('users.edit.isActive')}</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            defaultChecked={!!user.is_banned}
            onChange={(e) => setData((d) => ({ ...d, is_banned: e.target.checked }))}
          />
          <span className="text-sm">{t('users.edit.isBanned')}</span>
        </label>
      </form>
    </Modal>
  );
}
