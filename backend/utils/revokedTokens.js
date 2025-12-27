import fs from "fs/promises";
import path from "path";

const revokedFile = path.resolve("./backend/data/revoked_tokens.json");

async function readRevoked() {
  const raw = await fs.readFile(revokedFile, "utf8");
  const list = JSON.parse(raw || "[]");

  // Drop expired entries
  const now = Math.floor(Date.now() / 1000);
  const filtered = Array.isArray(list) ? list.filter((x) => x && x.jti && x.exp && x.exp > now) : [];

  if (filtered.length !== list.length) {
    await fs.writeFile(revokedFile, JSON.stringify(filtered, null, 2));
  }

  return filtered;
}

export async function isRevoked(jti) {
  if (!jti) return false;
  const list = await readRevoked();
  return list.some((x) => x.jti === jti);
}

export async function revokeToken(jti, exp) {
  if (!jti || !exp) return;
  const list = await readRevoked();
  if (list.some((x) => x.jti === jti)) return;

  list.push({ jti, exp });
  await fs.writeFile(revokedFile, JSON.stringify(list, null, 2));
}
