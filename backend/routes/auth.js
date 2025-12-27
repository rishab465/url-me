import express from "express";
import authcontroller from "../controllers/authcontroller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", authcontroller.signup);
router.post("/login", authcontroller.login);
router.post("/logout", requireAuth, authcontroller.logout);
router.get("/me", requireAuth, authcontroller.me);

export default router;
