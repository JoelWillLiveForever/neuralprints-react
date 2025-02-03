import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'

// styles
import './styles/_custom_bootstrap.scss'
import './index.scss'

// // import Bootstrap
// import "bootstrap/dist/css/bootstrap.min.css";

// React theme provider
// import { ThemeProvider, useTheme } from './context/ThemeContext';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
