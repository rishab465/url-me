import express from "express";
import urlcontroller from "../controllers/urlcontroller.js";
const router = express.Router();

router.post("/create" , urlcontroller.shortenUrl );
router.get("/:code" , urlcontroller.redirectUrl);

export default router;