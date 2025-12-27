// Global OPTIONS handler for CORS preflight (must be before routes)
app.options("/api/urls/*", cors(), (req, res) => {
  res.sendStatus(204);
});
// Simple file-backed URL shortener server (no external DB)
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/router.js";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
// When running behind Render / reverse proxies, trust the forwarded protocol.
// This makes req.protocol reflect https when the platform terminates TLS.
app.set("trust proxy", 1);

// CORS
// In production, prefer setting CORS_ORIGINS to a comma-separated list of allowed frontends.
// Example: https://urlme.com,https://www.urlme.com
const rawOrigins = process.env.CORS_ORIGINS || "";
const allowedOrigins = rawOrigins
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // allow same-origin / server-to-server / curl
      if (!origin) return callback(null, true);

      // If not configured, allow all (useful for local dev).
      if (allowedOrigins.length === 0) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());

// Ensure data directory exists
const dataDir = path.resolve("./backend/data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dataFile = path.join(dataDir, "urls.json");
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]");

app.use("/api/urls", router);

app.get("/", (req, res) => {
  res.send("Backend is running ✅ (no DB)");
});

// Start server
// Default to 5050 to avoid common conflicts with other local services.
const PORT = Number(process.env.PORT || 5050);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

