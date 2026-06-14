import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useLanguageSync() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    document.documentElement.lang = lang;
    // dir stays 'rtl' always (set in index.html) — layout is locked
  }, [lang]);
}
