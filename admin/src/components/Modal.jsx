import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, footer, width = 480 }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="panel w-full max-w-full" style={{ maxWidth: width }}>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-3">{footer}</div>
        )}
      </div>
    </div>
  );
}
