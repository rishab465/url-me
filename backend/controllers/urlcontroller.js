import { nanoid } from "nanoid";
import validUrl from "valid-url";
import fs from "fs/promises";
import path from "path";
import axios from "axios";

const dataFile = path.resolve("./backend/data/urls.json");

async function readUrls() {
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw || "[]");
}

async function writeUrls(urls) {
  await fs.writeFile(dataFile, JSON.stringify(urls, null, 2));
}

function getCookie(req, name) {
  const header = req.headers.cookie || "";
  const parts = header.split(";").map((p) => p.trim());
  for (const part of parts) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx);
    const val = part.slice(idx + 1);
    if (key === name) return decodeURIComponent(val);
  }
  return "";
}

function ensureClientId(req, res) {
  const existing = getCookie(req, "urlme_cid");
  if (existing) return existing;

  const cid = nanoid(18);
  // Anonymous, browser-scoped identifier. Used only to separate "my URLs" without login.
  // For best results in production, deploy frontend+backend on the same site (same eTLD+1).
  const sameSite = (process.env.COOKIE_SAMESITE || "Lax").trim();
  const secure = String(process.env.COOKIE_SECURE || "").toLowerCase() === "true";
  const domain = (process.env.COOKIE_DOMAIN || "").trim();

  const parts = [
    `urlme_cid=${encodeURIComponent(cid)}`,
    "Path=/",
    `SameSite=${sameSite}`,
    "HttpOnly",
  ];
  if (secure) parts.push("Secure");
  if (domain) parts.push(`Domain=${domain}`);

  res.setHeader("Set-Cookie", parts.join("; "));
  return cid;
}

const shortenUrl = async (req, res) => {
  try {
    const { custom_id, long_url } = req.body;
    if (!long_url || !validUrl.isUri(long_url)) {
      return res.status(400).json({ success: false, error: "Invalid Url" });
    }

    const url_code = custom_id ? String(custom_id) : nanoid(8);
    const urls = await readUrls();
    if (urls.find(u => u.url_code === url_code)) {
      return res.status(400).json({ success: false, error: "Custom id already in use" });
    }

    // Prefer an explicit public base URL, otherwise derive from the incoming request.
    // This works in dev with Vite proxy (host will be the Vite origin).
    const publicBase = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
    const short_url = `${publicBase}/api/urls/${url_code}`;

    const clientId = ensureClientId(req, res);
    const item = {
      url_code,
      long_url,
      short_url,
      clicks: 0,
      createdAt: new Date().toISOString(),
      clientId,
    };
    urls.push(item);
    await writeUrls(urls);
    return res.status(201).json({ success: true, message: "Link shortened", short_url: item.short_url, code: item.url_code });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Some error occurred" });
  }
};

const listMine = async (req, res) => {
  try {
    const clientId = getCookie(req, "urlme_cid");
    if (!clientId) {
      // No cookie yet => no "mine".
      return res.json({ success: true, urls: [] });
    }

    const urls = await readUrls();
    const mine = urls
      .filter((u) => u.clientId && u.clientId === clientId)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

    return res.json({ success: true, urls: mine });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to load URLs" });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const code = req.params.code;
    const urls = await readUrls();
    const idx = urls.findIndex(u => u.url_code === code);
    if (idx === -1) return res.status(404).send("Not found");
    urls[idx].clicks = (urls[idx].clicks || 0) + 1;
    await writeUrls(urls);
    return res.redirect(urls[idx].long_url);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const previewUrl = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing url" });
    try { new URL(url); } catch (e) { return res.status(400).json({ error: "Invalid URL" }); }

    const resp = await axios.get(url, { headers: { 'User-Agent': 'url-me/1.0' }, timeout: 5000 });
    const text = resp.data;
    const m = String(text).match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = m ? m[1].trim() : null;
    return res.json({ title });
  } catch (error) {
    console.error('previewUrl error:', error.message || error);
    return res.status(500).json({ error: 'Unable to fetch preview' });
  }
};

export default { shortenUrl, redirectUrl, previewUrl, listMine };


