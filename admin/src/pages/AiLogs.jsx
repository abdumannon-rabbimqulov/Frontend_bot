import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { aiLogs } from '../lib/api.js';

const LIMIT = 25;
const STATUSES = ['pending', 'success', 'failed'];

export default function AiLogs() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ status: '', command_type: '', user_id: '' });

  const params = useMemo(() => {
    const p = { skip: page * LIMIT, limit: LIMIT };
    if (filters.status) p.status = filters.status;
    if (filters.command_type) p.command_type = filters.command_type;
    if (filters.user_id) p.user_id = filters.user_id;
    return p;
  }, [page, filters]);

  const q = useQuery({ queryKey: ['admin/ai/logs', params], queryFn: () => aiLogs.list(params) });

  const items = q.data?.items ?? [];
  const total = q.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / LIMIT));

  const columns = [
    {
      key: 'time',
      title: t('ai.table.time'),
      render: (r) => (
        <span className="text-muted">{new Date(r.created_at).toLocaleString()}</span>
      ),
    },
    { key: 'user', title: t('ai.table.user'), render: (r) => `#${r.user_id ?? '—'}` },
    {
      key: 'command',
      title: t('ai.table.command'),
      render: (r) => <span className="font-medium text-white">{r.command_type}</span>,
    },
    {
      key: 'status',
      title: t('ai.table.status'),
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'input',
      title: t('ai.table.input'),
      cellClass: 'max-w-[260px] truncate',
      render: (r) => <span className="text-muted">{r.raw_input || '—'}</span>,
    },
    {
      key: 'error',
      title: t('ai.table.error'),
      cellClass: 'max-w-[260px] truncate',
      render: (r) => (
        <span className={r.error_msg ? 'text-danger' : 'text-muted'}>{r.error_msg || '—'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('ai.title')}</h2>

      <div className="panel panel-pad flex flex-wrap items-center gap-3">
        <select
          className="input"
          value={filters.status}
          onChange={(e) => {
            setPage(0);
            setFilters((f) => ({ ...f, status: e.target.value }));
          }}
        >
          <option value="">{t('common.all')}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          className="input"
          placeholder={t('ai.filters.type')}
          value={filters.command_type}
          onChange={(e) => {
            setPage(0);
            setFilters((f) => ({ ...f, command_type: e.target.value }));
          }}
        />
        <input
          className="input"
          placeholder={t('ai.filters.userId')}
          value={filters.user_id}
          onChange={(e) => {
            setPage(0);
            setFilters((f) => ({ ...f, user_id: e.target.value }));
          }}
        />
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
    </div>
  );
}
