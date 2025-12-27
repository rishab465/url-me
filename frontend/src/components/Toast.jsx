import React, { useEffect } from "react";

export default function Toast({ show, message, type = "info", onClose }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose?.(), 3000);
    return () => clearTimeout(t);
  }, [show, onClose]);

  if (!show) return null;

  const base = "fixed right-4 bottom-6 z-50 px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-3";
  const cls =
    type === "error"
      ? `${base} bg-red-600 text-white`
      : `${base} bg-indigo-600 text-white`;

  return (
    <div className={cls} role="status">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-90"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/></svg>
      <div className="truncate">{message}</div>
      <button onClick={onClose} className="ml-3 opacity-80 hover:opacity-100">✕</button>
    </div>
  );
}
