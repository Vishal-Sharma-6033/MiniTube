import Router from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createTweet, deleteTweet, getUserTweet, updateTweet } from "../controllers/tweet.controllers.js";

const router=Router()

router.route("/").post(verifyJWT,createTweet)
router.route("/:id").delete(verifyJWT,deleteTweet)
router.route("/:id").patch(verifyJWT,updateTweet)
router.route("/:id").get(verifyJWT,getUserTweet)

export default router;