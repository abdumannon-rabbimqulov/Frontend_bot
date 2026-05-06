const MAP = {
  active: 'badge-success',
  pending: 'badge-warning',
  accepted: 'badge-info',
  in_progress: 'badge-info',
  completed: 'badge-success',
  cancelled: 'badge-muted',
  banned: 'badge-danger',
  inactive: 'badge-muted',
  rejected: 'badge-danger',
  failed: 'badge-danger',
  success: 'badge-success',
};

export default function StatusBadge({ status, label }) {
  const cls = MAP[status] || 'badge-muted';
  return <span className={cls}>{label || status}</span>;
}
