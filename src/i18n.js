import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './locales/en/translations.json';
import translationTH from './locales/th/translations.json';

// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init
const resources = {
    en: {
        translation: translationEN,
    },
    th: {
        translation: translationTH,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'th',
        fallbackLng: 'en', // use en if detected lng is not available

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
