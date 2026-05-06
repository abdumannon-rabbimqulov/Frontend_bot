import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGS = [
  { code: 'uz', label: "O'zbek (lotin)" },
  { code: 'uz_cyrl', label: 'Ўзбек (кирилл)' },
  { code: 'ru', label: 'Русский' },
];

export default function LangSwitcher() {
  const { i18n } = useTranslation();
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs">
      <Globe size={14} className="text-muted" />
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="bg-transparent text-white outline-none"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code} className="bg-bg">
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
