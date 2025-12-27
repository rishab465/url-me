import React, { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import QRCode from "react-qr-code";
import Toast from "./Toast";

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState(null);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/url/mine");
        setHistory(res.data?.urls || []);
      } catch {
        setHistory([]);
      }
    })();
  }, []);

  const refreshHistory = async () => {
    try {
      const res = await api.get("/api/url/mine");
      setHistory(res.data?.urls || []);
    } catch {
      setHistory([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShortUrl("");
    setError("");

    if (!longUrl) return setError("Please enter a URL");
    // client-side validation
    try { new URL(longUrl); } catch (e) { return setError("Please enter a valid URL (include http:// or https://)"); }

    try {
      setLoading(true);
      const response = await api.post(`/api/url/create`, {
        long_url: longUrl,
        custom_id: customUrl || undefined,
      });

      if (response.data.short_url) {
        setShortUrl(response.data.short_url);
        await refreshHistory();
        setCopied(false);
      } else {
        setError(response.data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.error || err.response?.data?.msg || err.message;
      setError(serverMsg || "Server error. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setShowToast({ show: true, message: "Copied to clipboard", type: "info" });
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const [showToast, setShowToast] = useState({ show: false, message: "", type: "info" });

  const handleUse = (item) => {
    setLongUrl(item.long_url);
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // fetch preview (debounced) when longUrl changes
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (!longUrl) { setPreview(null); return; }
    const t = setTimeout(async () => {
      try {
        // ensure URL looks valid
        try { new URL(longUrl); } catch (e) { setPreview(null); return; }
        const res = await api.get(`/api/url/preview`, { params: { url: longUrl } });
        setPreview(res.data.title || null);
      } catch (e) {
        setPreview(null);
      }
    }, 700);
    setDebounceTimer(t);
    return () => clearTimeout(t);
  }, [longUrl]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="hero-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Shorten links instantly</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Paste a URL, customize the slug (optional), and get a short link you can share.</p>
          </div>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">No signup • No tracking</div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-3">
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">Enter a long URL</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/very/long/link"
                className="form-input w-full"
                disabled={loading}
              />
              <button type="submit" className="primary-btn sm:whitespace-nowrap" disabled={loading}>
                {loading ? 'Shortening...' : 'Shorten'}
              </button>
            </div>
            {preview && (
              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Preview: <span className="text-slate-700 dark:text-slate-200">{preview}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">Custom slug</label>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="custom-id"
              className="form-input w-full"
              disabled={loading}
            />
          </div>
        </form>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 dark:text-red-200 dark:bg-red-500/10 dark:border-red-500/30">
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2 recent-item">
              <div className="text-xs text-slate-500 dark:text-slate-400">Shortened URL</div>
              <div className="flex items-center justify-between gap-3 mt-2">
                <a href={shortUrl} target="_blank" rel="noreferrer" className="text-teal-600 dark:text-teal-300 font-medium truncate max-w-full">
                  {shortUrl}
                </a>
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} className="primary-btn px-3 py-1 rounded" type="button">{copied ? "Copied" : "Copy"}</button>
                  <button onClick={() => {
                    const svg = document.querySelector('svg');
                    if (!svg) return;
                    const serializer = new XMLSerializer();
                    const src = serializer.serializeToString(svg);
                    const blob = new Blob([src], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'qr.svg';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  }} className="secondary-btn" type="button">Download QR</button>
                  <button onClick={async ()=>{
                    if (navigator.share) {
                      try { await navigator.share({ title: 'Short URL', text: shortUrl, url: shortUrl }); } catch(e){}
                    } else {
                      setShowToast({ show: true, message: 'Share not available on this device', type: 'info' });
                    }
                  }} className="secondary-btn" type="button">Share</button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-100 dark:bg-slate-950/30 dark:border-slate-800">
                <QRCode value={shortUrl} size={140} />
              </div>
            </div>
          </div>
        )}

        <Toast
          show={showToast.show}
          message={showToast.message}
          type={showToast.type}
          onClose={() => setShowToast({ show: false, message: "" })}
        />

        <div className="mt-6">
          <h3 className="text-sm text-slate-600 dark:text-slate-300 mb-3">Recent</h3>
          {history.length === 0 && <div className="text-sm text-slate-400 dark:text-slate-500">No recent links yet</div>}
          <ul className="grid gap-2">
            {history.map((it, idx) => (
              <li key={idx} className="recent-item flex items-center justify-between">
                <div className="flex-1 truncate">
                  <div className="text-xs text-slate-500 dark:text-slate-400">{it.createdAt ? new Date(it.createdAt).toLocaleString() : ""}</div>
                  <div className="text-sm text-slate-800 dark:text-slate-200 truncate">{it.short_url}</div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => { navigator.clipboard.writeText(it.short_url); setCopied(true); setTimeout(()=>setCopied(false),1500); }} className="text-sm text-teal-600 dark:text-teal-300" type="button">Copy</button>
                  <button onClick={() => handleUse(it)} className="text-sm text-slate-600 dark:text-slate-300" type="button">Use</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UrlShortener;
