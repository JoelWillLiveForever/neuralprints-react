import { create } from 'zustand';
import i18n from 'i18next';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'ru-ru' | 'en-us';

interface PreferencesState {
    theme: Theme;
    language: Language;
    setTheme: (theme: Theme) => void;
    setLanguage: (language: Language) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
    theme: (localStorage.getItem('theme') as Theme) || 'system',
    language: (localStorage.getItem('language') as Language) || 'en-us',
    setTheme: (theme) => {
        localStorage.setItem('theme', theme);
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
    },
    setLanguage: (language) => {
        localStorage.setItem('language', language);
        i18n.changeLanguage(language);
        set({ language });
    },
}));