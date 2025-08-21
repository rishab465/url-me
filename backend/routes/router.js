import express from "express";
import urlcontroller from "../controllers/urlcontroller.js";
const router = express.Router();
import auth from "../middlewares/auth.js"

router.post("/create" , auth , urlcontroller.shortenUrl );
router.post("/user" , urlcontroller.createUser)
router.post("/login" , urlcontroller.loginUser)
router.post("/getUrl" , auth , urlcontroller.getUrls)
router.get("/:code" , urlcontroller.redirectUrl);

export default router;