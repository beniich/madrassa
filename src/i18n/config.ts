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
import commonNo from './locales/no.json'; // Keeping 'no' if it matches the file, but user asked for Danish (da), Dutch (nl). 'no' is Norwegian.
import commonAr from './locales/ar.json';
import commonNl from './locales/nl.json';
import commonDa from './locales/da.json';

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
    nl: { translation: commonNl },
    da: { translation: commonDa },
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
        fallbackLng: 'en', // Default language to English
        debug: true,

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },

        // Default to English if detection fails or matches nothing
        lng: "en",
    });

// Handle RTL for Arabic
i18n.on('languageChanged', (lng) => {
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

export default i18n;
