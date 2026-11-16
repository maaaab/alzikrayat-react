import express from "express"
import { getAll, getOne, create, remove } from "../controllers/photoController.js";
import { requireAuth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import replyRoutes from "./commentRoutes.js";
const pictureRoutes = express.Router();
pictureRoutes.get("/",getAll)
pictureRoutes.get("/:id", getOne)
pictureRoutes.post("/", requireAuth, upload.single("photo"), create);
pictureRoutes.delete("/:id", requireAuth, remove);
pictureRoutes.use("/:id/comments", replyRoutes);
export default pictureRoutes;
