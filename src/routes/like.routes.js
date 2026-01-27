import { Router } from "express";
import { toggleVideoLike, toggleCommentLike, toggleTweetLike,getLikedVideos } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const likeRouter = Router();

likeRouter.use(verifyJWT);

likeRouter.route("/toggle/video/:videoId").post(toggleVideoLike);
likeRouter.route("/toggle/comment/:commentId").post(toggleCommentLike);
likeRouter.route("/toggle/tweet/:tweetId").post(toggleTweetLike);
likeRouter.route("/videos").get(getLikedVideos);

export default likeRouter;