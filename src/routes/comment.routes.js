import Router from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  addComment,
  deleteComment,
  getVideoComment,
  updateComment,
} from "../controllers/comment.controllers.js";

const router = Router();
router.use(verifyJWT);

router.route("/:videoId").get(getVideoComment).post(addComment);

router.route("/:commentId").delete(deleteComment).patch(updateComment);

export default router;
