import express from "express";
import urlcontroller from "../controllers/urlcontroller.js";
const router = express.Router();

// Allow preflight OPTIONS for all routes (CORS)
router.options("*", (req, res) => {
	res.sendStatus(204);
});

router.get("/mine", urlcontroller.listMine);
router.post("/create", urlcontroller.shortenUrl);
router.get("/preview", urlcontroller.previewUrl);
router.get("/:code", urlcontroller.redirectUrl);

export default router;