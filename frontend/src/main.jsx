import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// Theme
// Default is dark, but we persist user choice in localStorage.
const THEME_KEY = 'urlme_theme';
const savedTheme = localStorage.getItem(THEME_KEY);
const isDark = savedTheme ? savedTheme === 'dark' : true;
document.documentElement.classList.toggle('dark', isDark);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
