import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  // If VITE_API_URL is set (e.g. http://localhost:5050), use it.
  // Otherwise fall back to same-origin and rely on Vite's /api proxy.
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
