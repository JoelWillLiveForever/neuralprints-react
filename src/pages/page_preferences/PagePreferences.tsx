// import React from 'react';
import { useTranslation } from 'react-i18next';

import { usePreferencesStore } from '../../store/PreferencesStore';
import Header4Container from '../../components/header_4_container/Header4Container';

import Flag from 'react-flagpack';
import 'react-flagpack/dist/style.css';

import './page_preferences.scss';

const PagePreferences = () => {
    const { t, i18n } = useTranslation();
    
    const { theme, setTheme, language, setLanguage } = usePreferencesStore();

    return (
        <div className="page-preferences-container">
            {/* <h1>Настройки</h1> */}

            <section>
                <Header4Container text={t('preferences.language')} />
                <div className="custom-radio-group">
                    <label className="custom-radio">
                        <div className="custom-radio__circle-container">
                            <input
                                type="radio"
                                name="language"
                                value="en"
                                checked={language === 'ru-ru'}
                                onChange={() => setLanguage('ru-ru')}
                            />
                            <span className="custom-radio__circle"></span>
                        </div>

                        <div className="custom-radio__text-container">
                            <strong>{t('preferences.languages.ru-ru')}</strong>
                        </div>

                        <div className="custom-radio__flag-container">
                            <Flag className="flag" code="RU" hasBorder={false} hasBorderRadius />
                        </div>
                    </label>

                    <label className="custom-radio">
                        <div className="custom-radio__circle-container">
                            <input
                                type="radio"
                                name="language"
                                value="en"
                                checked={language === 'en-us'}
                                onChange={() => setLanguage('en-us')}
                            />
                            <span className="custom-radio__circle"></span>
                        </div>

                        <div className="custom-radio__text-container">
                            <strong>{t('preferences.languages.en-us')}</strong>
                        </div>

                        <div className="custom-radio__flag-container">
                            <Flag className="flag" code="US" hasBorder={false} hasBorderRadius />
                        </div>
                    </label>
                </div>
            </section>

            <section>
                <Header4Container text={t('preferences.theme')} />
                <div className="custom-radio-group">
                    {['light', 'dark', 'system'].map((mode) => (
                        <label key={mode} className="custom-radio">
                            <div className="custom-radio__circle-container">
                                <input
                                    type="radio"
                                    name="theme"
                                    value={mode}
                                    checked={theme === mode}
                                    onChange={() => setTheme(mode as any)}
                                />
                                <span className="custom-radio__circle"></span>
                            </div>
                            <div className="custom-radio__text-container">
                                <strong>
                                    {
                                        {
                                            light: t('preferences.themes.light'),
                                            dark: t('preferences.themes.dark'),
                                            system: t('preferences.themes.system'),
                                        }[mode]
                                    }
                                </strong>
                            </div>
                            <div className='custom-radio__icon-container'>
                                <i
                                    className={
                                        {
                                            light: 'bi bi-sun-fill',
                                            dark: 'bi bi-moon-fill',
                                            system: 'bi bi-circle-half',
                                        }[mode]
                                    }
                                ></i>
                            </div>
                        </label>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PagePreferences;
