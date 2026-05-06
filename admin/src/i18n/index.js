import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import uz from './uz.json';
import uz_cyrl from './uz_cyrl.json';
import ru from './ru.json';

const STORAGE_KEY = 'admin_lang';

const supported = ['uz', 'uz_cyrl', 'ru'];

function detect() {
  const stored = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY);
  if (stored && supported.includes(stored)) return stored;
  return 'uz';
}

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    uz_cyrl: { translation: uz_cyrl },
    ru: { translation: ru },
  },
  lng: detect(),
  fallbackLng: 'uz',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, lng);
});

export default i18n;
export const SUPPORTED_LANGS = supported;
