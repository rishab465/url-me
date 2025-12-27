import React from "react";

export default function Docs() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="hero-card">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Docs
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Quick guide to using UrlMe and its API.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <section className="recent-item">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">How to use</h2>
            <ul className="mt-2 text-sm text-slate-600 dark:text-slate-300 grid gap-2">
              <li>1) Paste a long URL and click Shorten.</li>
              <li>2) Optionally set a custom slug (if available).</li>
              <li>3) Copy the short URL, download the QR, or share it.</li>
            </ul>
          </section>

          <section className="recent-item">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Privacy</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Your “Recent” list is scoped to this browser via an anonymous cookie. Other users won’t see your history.
              Note: the short link itself is still public to anyone who has the URL.
            </p>
          </section>

          <section className="recent-item">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">API</h2>
            <div className="mt-2 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">POST</span> /api/urls/create
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Body: {"{"} long_url, custom_id? {"}"}
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">GET</span> /api/urls/mine
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Returns only your browser’s shortened URLs (cookie-scoped).
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">GET</span> /api/urls/preview?url=...
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Returns a basic title preview for a given URL.
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">GET</span> /api/urls/:code
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Redirects to the original URL.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
