import { useTranslation } from 'react-i18next';

export default function DataTable({ columns, rows, isLoading, emptyText, footer }) {
  const { t } = useTranslation();
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-muted">
              {columns.map((c) => (
                <th key={c.key} className={`px-4 py-3 ${c.headerClass || ''}`}>
                  {c.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted">
                  {t('common.loading')}
                </td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted">
                  {emptyText || t('common.noData')}
                </td>
              </tr>
            )}
            {!isLoading &&
              rows.map((row, i) => (
                <tr key={row.__key ?? i} className="table-row hover:bg-white/[0.02]">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 align-middle ${c.cellClass || ''}`}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {footer && <div className="border-t border-white/10 px-4 py-3 text-xs text-muted">{footer}</div>}
    </div>
  );
}
