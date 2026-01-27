import { Router } from "express";
import { addComment, updateComment, deleteComment, getVideoComments } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const commentRouter = Router();

commentRouter.use(verifyJWT); // apply verifyJWT middleware to all routes in this file

commentRouter.route("/:videoId").get(getVideoComments).post(addComment);
commentRouter.route("/comment/:commentId").delete(deleteComment).patch(updateComment);

export default commentRouter;