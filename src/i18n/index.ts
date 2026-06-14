import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import heCommon from './locales/he/common.json';
import enCommon from './locales/en/common.json';
import elCommon from './locales/el/common.json';

import heHome from './locales/he/home.json';
import enHome from './locales/en/home.json';
import elHome from './locales/el/home.json';

import heAbout from './locales/he/about.json';
import enAbout from './locales/en/about.json';
import elAbout from './locales/el/about.json';

import heServices from './locales/he/services.json';
import enServices from './locales/en/services.json';
import elServices from './locales/el/services.json';

import hePortfolio from './locales/he/portfolio.json';
import enPortfolio from './locales/en/portfolio.json';
import elPortfolio from './locales/el/portfolio.json';

import heContact from './locales/he/contact.json';
import enContact from './locales/en/contact.json';
import elContact from './locales/el/contact.json';

export const LANGUAGES = {
  he: { label: 'עברית', flag: '🇮🇱', dir: 'rtl' as const },
  en: { label: 'English', flag: '🇬🇧', dir: 'ltr' as const },
  el: { label: 'Ελληνικά', flag: '🇬🇷', dir: 'ltr' as const },
} as const;

export type LangCode = keyof typeof LANGUAGES;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      he: { common: heCommon, home: heHome, about: heAbout, services: heServices, portfolio: hePortfolio, contact: heContact },
      en: { common: enCommon, home: enHome, about: enAbout, services: enServices, portfolio: enPortfolio, contact: enContact },
      el: { common: elCommon, home: elHome, about: elAbout, services: elServices, portfolio: elPortfolio, contact: elContact },
    },
    defaultNS: 'common',
    fallbackLng: 'he',
    supportedLngs: ['he', 'en', 'el'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'media-center-lang',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
