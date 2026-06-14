import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, type LangCode } from './index';

export function useLanguageSync() {
  const { i18n } = useTranslation();
  const lang = i18n.language as LangCode;
  const info = LANGUAGES[lang] ?? LANGUAGES.he;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = info.dir;
  }, [lang, info.dir]);
}
