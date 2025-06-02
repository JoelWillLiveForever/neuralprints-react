import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'ru' | 'en';

interface PreferencesState {
    theme: Theme;
    language: Language;
    setTheme: (theme: Theme) => void;
    setLanguage: (language: Language) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
    theme: (localStorage.getItem('theme') as Theme) || 'system',
    language: (localStorage.getItem('language') as Language) || 'ru',
    setTheme: (theme) => {
        localStorage.setItem('theme', theme);
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
    },
    setLanguage: (language) => {
        localStorage.setItem('language', language);
        set({ language });
    },
}));
