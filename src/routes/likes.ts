import express  from "express";
import { addLike, deleteLike, getLikes } from "../controllers/likes.js";

const router = express.Router()

router.get("/:postId", getLikes)
router.put("/:postId", addLike)
router.delete("/:postId", deleteLike)

export default router