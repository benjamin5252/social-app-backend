import express  from "express";
import { addRelationship, deleteRelationship, getFriendList, getRelationship } from "../controllers/relationships.js";

const router = express.Router()

router.get("/", getRelationship)
router.put("/", addRelationship)
router.delete("/", deleteRelationship)
router.get("/friends", getFriendList)

export default router