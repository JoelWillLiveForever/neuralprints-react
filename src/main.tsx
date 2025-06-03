import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';

// languages
import './locales/i18n';
import i18n from 'i18next';

const savedLanguage = localStorage.getItem('language');
if (savedLanguage) {
    i18n.changeLanguage(savedLanguage);
}

// styles
import './styles/_custom_bootstrap.scss';
import './index.scss';

// // import Bootstrap
// import "bootstrap/dist/css/bootstrap.min.css";

// React theme provider
// import { ThemeProvider, useTheme } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
