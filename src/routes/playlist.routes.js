import Router from "express"

const router=Router();
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylist, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controllers.js";
router.use(verifyJWT);

router.route("/").post(createPlaylist)
router.route("/:id").delete(deletePlaylist)
router.route("/:id").patch(updatePlaylist)
router.route("/:id").get(getPlaylistById)
router.route("/user/:id").get(getUserPlaylist)
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);


export default router