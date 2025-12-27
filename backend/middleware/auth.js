import jwt from "jsonwebtoken";
import { isRevoked } from "../utils/revokedTokens.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");

  if (!token) {
    return res.status(401).json({ success: false, error: "Missing auth token" });
  }

  try {
    const secret = process.env.JWT_SECRET || "dev-secret-change-me";
    const payload = jwt.verify(token, secret);
    if (await isRevoked(payload.jti)) {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    req.token = token;
    req.auth = payload;
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}
