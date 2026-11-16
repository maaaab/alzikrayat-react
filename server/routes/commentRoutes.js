import express from "express";
import { create } from "../controllers/commentController.js";
import { requireAuth } from "../middleware/auth.js";

const replyRoutes = express.Router({ mergeParams: true });
replyRoutes.post("/", requireAuth, create);

export default replyRoutes;
