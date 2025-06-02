import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enUs from './en-us/translation.json';
import ruRu from './ru-ru/translation.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: 'en-us',
        fallbackLng: 'en-us',
        supportedLngs: ['ru-ru', 'en-us'],
        lowerCaseLng: true,
        resources: {
            'en-us': { translation: enUs },
            'ru-ru': { translation: ruRu },
        },
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'i18nextLng',
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
