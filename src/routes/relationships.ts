import express  from "express";
import { addRelationship, deleteRelationship, getRelationship } from "../controllers/relationships.js";

const router = express.Router()

router.get("/:userId", getRelationship)
router.put("/:userId", addRelationship)
router.delete("/:userId", deleteRelationship)

export default router