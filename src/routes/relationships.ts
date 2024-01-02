import express  from "express";
import { addRelationship, deleteRelationship, getRelationship } from "../controllers/relationships.js";

const router = express.Router()

router.get("/", getRelationship)
router.put("/", addRelationship)
router.delete("/", deleteRelationship)

export default router