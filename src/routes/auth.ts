import express from "express";
import { login, register, logout } from "../controllers/auth.js";
import { registerDataCheck, loginDataCheck } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", loginDataCheck, login);
router.post("/register", registerDataCheck, register);
router.post("/logout", logout);

export default router;
