export default function KpiCard({ icon: Icon, title, value, hint, color = 'primary' }) {
  const tone = {
    primary: 'text-primary border-primary/25 bg-primary/10',
    success: 'text-success border-success/25 bg-success/10',
    warning: 'text-warning border-warning/25 bg-warning/10',
    danger: 'text-danger border-danger/25 bg-danger/10',
    indigo: 'text-indigo-300 border-indigo-300/25 bg-indigo-300/10',
  }[color];
  return (
    <div className="panel panel-pad flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <p className="text-[11px] uppercase tracking-wider text-muted">{title}</p>
        {Icon && (
          <div className={`rounded-xl border p-2 ${tone}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className="text-3xl font-black leading-none text-white">{value}</p>
      {hint && <p className="text-[11px] text-success">{hint}</p>}
    </div>
  );
}
