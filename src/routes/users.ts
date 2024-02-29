import express from "express";
import { getUser, searchUser, updateUser } from "../controllers/users.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.put("/", updateUser);
router.get("/search/:searchStr", searchUser);

export default router;
