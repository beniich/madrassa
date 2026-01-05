import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonEn from './locales/en.json';
import commonFr from './locales/fr.json';
import commonEs from './locales/es.json';
import commonIt from './locales/it.json';
import commonPt from './locales/pt.json';
import commonDe from './locales/de.json';
import commonJa from './locales/ja.json';
import commonNo from './locales/no.json';
import commonAr from './locales/ar.json';

// Configure standard resources
const resources = {
    en: { translation: commonEn },
    fr: { translation: commonFr },
    es: { translation: commonEs },
    it: { translation: commonIt },
    pt: { translation: commonPt },
    de: { translation: commonDe },
    ja: { translation: commonJa },
    no: { translation: commonNo },
    ar: { translation: commonAr },
};

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources,
        fallbackLng: 'en',
        debug: true,

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },

        // Check for Arabic for RTL support (can be extended)
        lng: "en", // Default language
    });

export default i18n;
