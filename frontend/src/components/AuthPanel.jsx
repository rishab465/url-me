import React, { useState } from "react";
import api from "../lib/api";
import { setToken } from "../lib/auth";

export default function AuthPanel({ onAuthed }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const path = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const res = await api.post(path, { email, password });
      const token = res.data?.token;
      if (!token) throw new Error("Missing token");
      setToken(token);
      await onAuthed?.();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Auth failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-card max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {mode === "signup" ? "Create account" : "Login"}
        </h2>
        <button
          type="button"
          className="text-sm text-teal-600"
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
        >
          {mode === "signup" ? "Have an account?" : "New here?"}
        </button>
      </div>

      <form onSubmit={submit} className="mt-4 grid gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-2">Email</label>
          <input
            className="form-input w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">Password</label>
          <input
            className="form-input w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
          <div className="text-xs text-gray-500 mt-1">Min 6 characters</div>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button className="primary-btn w-full" disabled={loading} type="submit">
          {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Login"}
        </button>

        <div className="text-xs text-gray-500">
          To keep URLs private, shortening requires login.
        </div>
      </form>
    </div>
  );
}
