import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'

// import Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// React theme provider
// import { ThemeProvider, useTheme } from './context/ThemeContext';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
