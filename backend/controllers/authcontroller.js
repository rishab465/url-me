import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { revokeToken } from "../utils/revokedTokens.js";

const usersFile = path.resolve("./backend/data/users.json");

async function readUsers() {
  const raw = await fs.readFile(usersFile, "utf8");
  return JSON.parse(raw || "[]");
}

async function writeUsers(users) {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
}

function signToken(user) {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  const jti = nanoid(16);
  return jwt.sign(
    { sub: user.id, email: user.email, jti },
    secret,
    { expiresIn: "7d" },
  );
}

const signup = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      return res.status(400).json({ success: false, error: "Invalid email" });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
    }

    const users = await readUsers();
    if (users.some(u => u.email === normalizedEmail)) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = {
      id: nanoid(12),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    await writeUsers(users);

    const token = signToken(user);
    return res.status(201).json({
      success: true,
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Signup failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const users = await readUsers();
    const user = users.find(u => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Login failed" });
  }
};

const me = async (req, res) => {
  return res.json({ success: true, user: { id: req.user.id, email: req.user.email } });
};

const logout = async (req, res) => {
  try {
    // token is already verified in requireAuth middleware
    await revokeToken(req.auth?.jti, req.auth?.exp);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Logout failed" });
  }
};

export default { signup, login, me, logout };
