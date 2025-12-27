import React from "react";
import { Link } from "react-router-dom";


// Always dark mode, no toggle
document.documentElement.classList.add('dark');

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
        </div>
      </div>
    </header>
  );
}
