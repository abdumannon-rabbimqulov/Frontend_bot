import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Eye, CheckCircle2, XCircle, Trash2, X } from 'lucide-react';

import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { orders } from '../lib/api.js';

const STATUSES = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
const LIMIT = 20;

function routeOf(o) {
  const wp = o.waypoints || [];
  if (!wp.length) return '—';
  return `${wp[0].address || wp[0].city || '?'} → ${wp[wp.length - 1].address || wp[wp.length - 1].city || '?'}`;
}

export default function OrdersPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ status: '' });
  const [selected, setSelected] = useState(null);

  const params = useMemo(() => {
    const p = { skip: page * LIMIT, limit: LIMIT };
    if (filters.status) p.status = filters.status;
    return p;
  }, [page, filters]);

  const q = useQuery({ queryKey: ['admin/orders', params], queryFn: () => orders.list(params) });

  const update = useMutation({
    mutationFn: ({ id, data }) => orders.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin/orders'] }),
  });

  const remove = useMutation({
    mutationFn: (id) => orders.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin/orders'] }),
  });

  const items = q.data || [];

  const columns = [
    {
      key: 'id',
      title: t('orders.table.id'),
      render: (r) => (
        <div>
          <p className="font-medium text-white">#{r.id}</p>
          <p className="text-xs text-muted">{new Date(r.created_at).toLocaleString()}</p>
        </div>
      ),
    },
    { key: 'route', title: t('orders.table.route'), render: (r) => routeOf(r) },
    {
      key: 'weight',
      title: t('orders.table.weight'),
      render: (r) => `${r.weight} t`,
    },
    {
      key: 'price',
      title: t('orders.table.price'),
      render: (r) => `${Number(r.price).toLocaleString('uz-UZ')} ${r.currency || ''}`,
    },
    {
      key: 'status',
      title: t('orders.table.status'),
      render: (r) => <StatusBadge status={r.status} label={t(`orders.status.${r.status}`)} />,
    },
    {
      key: 'driver',
      title: t('orders.table.driver'),
      render: (r) => (r.driver_id ? `#${r.driver_id}` : '—'),
    },
    {
      key: 'actions',
      title: t('common.actions'),
      cellClass: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => setSelected(r)}
            className="rounded-lg border border-white/10 p-1.5 hover:bg-white/5"
            title={t('users.actions.view')}
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => update.mutate({ id: r.id, data: { status: 'accepted' } })}
            className="rounded-lg border border-success/20 p-1.5 text-success hover:bg-success/10"
            title={t('orders.actions.approve')}
          >
            <CheckCircle2 size={14} />
          </button>
          <button
            onClick={() => update.mutate({ id: r.id, data: { status: 'cancelled' } })}
            className="rounded-lg border border-warning/20 p-1.5 text-warning hover:bg-warning/10"
            title={t('orders.actions.reject')}
          >
            <XCircle size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`#${r.id} — ${t('orders.actions.delete')}?`)) remove.mutate(r.id);
            }}
            className="rounded-lg border border-danger/20 p-1.5 text-danger hover:bg-danger/10"
            title={t('orders.actions.delete')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('orders.title')}</h2>

      <div className="panel panel-pad flex flex-wrap items-center gap-3">
        <select
          className="input"
          value={filters.status}
          onChange={(e) => {
            setPage(0);
            setFilters({ status: e.target.value });
          }}
        >
          <option value="">{t('common.all')}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`orders.status.${s}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <DataTable
          columns={columns}
          rows={items.map((r) => ({ ...r, __key: r.id }))}
          isLoading={q.isLoading}
          footer={
            <div className="flex items-center justify-between">
              <span>
                {t('common.total')}: <strong className="text-white">{items.length}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="btn-outline disabled:opacity-50"
                >
                  ←
                </button>
                <span>{page + 1}</span>
                <button
                  disabled={items.length < LIMIT}
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-outline disabled:opacity-50"
                >
                  →
                </button>
              </div>
            </div>
          }
        />
        <OrderDetailDrawer order={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  );
}

function OrderDetailDrawer({ order, onClose }) {
  const { t } = useTranslation();
  if (!order) {
    return (
      <div className="panel panel-pad flex items-center justify-center text-sm text-muted">
        {t('common.noData')}
      </div>
    );
  }
  return (
    <div className="panel panel-pad space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{t('orders.detail.title')}</h3>
        <button onClick={onClose} className="text-muted hover:text-white">
          <X size={16} />
        </button>
      </div>
      <Field label={t('orders.detail.cargoName')} value={order.cargo_name} />
      <div className="grid grid-cols-2 gap-2">
        <Field label={t('orders.detail.weight')} value={`${order.weight} t`} />
        <Field label={t('orders.detail.volume')} value={order.volume ? `${order.volume} m³` : '—'} />
        <Field
          label={t('orders.detail.price')}
          value={`${Number(order.price).toLocaleString('uz-UZ')} ${order.currency}`}
        />
        <Field
          label={t('orders.detail.status')}
          value={<StatusBadge status={order.status} label={t(`orders.status.${order.status}`)} />}
        />
      </div>
      <Field label={t('orders.detail.customer')} value={`#${order.customer_id}`} />
      <Field
        label={t('orders.detail.driver')}
        value={order.driver_id ? `#${order.driver_id}` : '—'}
      />
      <div>
        <p className="mb-2 text-xs text-muted">{t('orders.detail.waypoints')}</p>
        <ol className="space-y-2">
          {(order.waypoints || []).map((wp) => (
            <li key={wp.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-sm">
              <span className="badge-info mr-2">{wp.sequence}. {wp.waypoint_type}</span>
              {wp.address || wp.city}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <div className="text-sm font-medium text-white">{value}</div>
    </div>
  );
}
