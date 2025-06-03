// import React from 'react';
import { useTranslation } from 'react-i18next';

import './page_main.scss';

const PageMain = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className="page-main-container">
            <div className="main-center-content">
                <h1 className="app-title">Neural Prints</h1>
                <p className="app-version">v1.0.0</p>
            </div>

            <footer className="main-footer">
                <hr className="footer-separator" />
                <div className="footer-copy">{t('main.copyright')}</div>
            </footer>
        </div>
    );
};

export default PageMain;
