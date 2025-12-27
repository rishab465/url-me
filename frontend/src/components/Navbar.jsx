import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const initialIsDark = useMemo(() => {
    const saved = localStorage.getItem('urlme_theme');
    if (saved === 'light') return false;
    if (saved === 'dark') return true;
    return document.documentElement.classList.contains('dark');
  }, []);
  const [isDark, setIsDark] = useState(initialIsDark);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('urlme_theme', next ? 'dark' : 'light');
  };

  return (
    <header className="w-full bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-30 border-b border-slate-200/70 dark:border-slate-800/70">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-400 rounded-lg flex items-center justify-center text-white font-extrabold text-base tracking-tight">UM</div>
          <div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">UrlMe</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Shorten links instantly</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
            <Link to="/docs" className="hover:text-slate-900 dark:hover:text-white">Docs</Link>
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900"
            aria-label="Toggle dark mode"
          >
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </header>
  );
}
