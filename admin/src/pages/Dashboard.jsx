import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Package,
  Truck,
  Sparkles,
  Bot,
  Users,
  CheckCircle2,
  XCircle,
  MapPin,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import KpiCard from '../components/KpiCard.jsx';
import { dashboard, aiLogs } from '../lib/api.js';

function fmt(n) {
  if (n === null || n === undefined) return '—';
  return Number(n).toLocaleString('uz-UZ');
}

export default function Dashboard() {
  const { t } = useTranslation();
  const stats = useQuery({ queryKey: ['admin/stats'], queryFn: dashboard.stats });
  const recent = useQuery({
    queryKey: ['admin/ai/recent'],
    queryFn: () => aiLogs.list({ skip: 0, limit: 8 }),
  });

  const s = stats.data;
  const activeOrders =
    (s?.orders_by_status?.pending || 0) +
    (s?.orders_by_status?.accepted || 0) +
    (s?.orders_by_status?.in_progress || 0);

  const chartData =
    s?.orders_last_7_days?.map((r) => ({
      date: r.date.slice(5),
      count: r.count,
    })) || [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Package}
          title={t('dashboard.kpi.activeOrders')}
          value={fmt(activeOrders)}
          color="primary"
        />
        <KpiCard
          icon={Truck}
          title={t('dashboard.kpi.onlineDrivers')}
          value={fmt(s?.drivers_live_gps)}
          hint={`${fmt(s?.drivers_online)} ${t('live.online')}`}
          color="success"
        />
        <KpiCard
          icon={Sparkles}
          title={t('dashboard.kpi.todayOffers')}
          value={fmt(s?.offers_today)}
          color="indigo"
        />
        <KpiCard
          icon={Bot}
          title={t('dashboard.kpi.aiRequests')}
          value={fmt(s?.ai_requests_today)}
          hint={`in ${fmt(s?.ai_input_tokens_today)} / out ${fmt(s?.ai_output_tokens_today)}`}
          color="warning"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="panel panel-pad">
          <h3 className="mb-3 text-sm font-semibold text-muted">{t('dashboard.chart.title')}</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0b1530',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="url(#gradOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel panel-pad">
          <h3 className="mb-3 text-sm font-semibold text-muted">{t('dashboard.summary.title')}</h3>
          <div className="grid grid-cols-2 gap-3">
            <SummaryItem icon={Users} label={t('dashboard.summary.totalUsers')} value={fmt(s?.users_total)} />
            <SummaryItem icon={Package} label={t('dashboard.summary.totalOrders')} value={fmt(s?.orders_total)} />
            <SummaryItem
              icon={CheckCircle2}
              label={t('dashboard.summary.completed')}
              value={fmt(s?.orders_by_status?.completed)}
              color="text-success"
            />
            <SummaryItem
              icon={XCircle}
              label={t('dashboard.summary.cancelled')}
              value={fmt(s?.orders_by_status?.cancelled)}
              color="text-danger"
            />
            <SummaryItem
              icon={MapPin}
              label={t('dashboard.summary.liveGps')}
              value={fmt(s?.drivers_live_gps)}
              color="text-primary"
            />
          </div>
        </div>
      </div>

      <div className="panel panel-pad">
        <h3 className="mb-3 text-sm font-semibold text-muted">{t('dashboard.recent.title')}</h3>
        {recent.isLoading ? (
          <div className="text-sm text-muted">{t('common.loading')}</div>
        ) : recent.data?.items?.length ? (
          <ul className="divide-y divide-white/5">
            {recent.data.items.map((cmd) => (
              <li key={cmd.id} className="flex items-center justify-between gap-4 py-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{cmd.command_type}</p>
                  <p className="truncate text-xs text-muted">{cmd.raw_input || '—'}</p>
                </div>
                <div className="text-right text-xs text-muted">
                  <p>user#{cmd.user_id}</p>
                  <p>{new Date(cmd.created_at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">{t('dashboard.recent.empty')}</p>
        )}
      </div>
    </div>
  );
}

function SummaryItem({ icon: Icon, label, value, color = 'text-white' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-1 flex items-center gap-2 text-[11px] text-muted">
        <Icon size={13} /> {label}
      </div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
