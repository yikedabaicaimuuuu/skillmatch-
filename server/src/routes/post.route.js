import express from "express";
import PostController from "../controllers/post.controller.js";
import postValidationMiddleware from "../middlewares/post.middleware.js";

// import authenticateUserMiddleware from "../middlewares/authenticate.middleware.js";

const postRouter = express.Router();

// postRouter.use(authenticateUserMiddleware);

postRouter.route("/create").post(postValidationMiddleware, PostController.createPost);
postRouter.route("/update/:postId").put(PostController.updatePost);
postRouter.route("/update-stats/:postId").patch(PostController.updateStats);
postRouter.route("/author/:authorId").get(PostController.getPostByAuthorId);
postRouter.route("/all").get(PostController.getAllPosts);
postRouter.route("/delete/:postId").delete(PostController.deletePost);
postRouter.route("/:postId").get(PostController.getPostById);

postRouter.route("/add-member").post(PostController.addMemberToProject); 
postRouter.route("/remove-member/:projectId/:userId").delete(PostController.removeMemberFromProject);
postRouter.route("/update-member/:projectId/:userId").patch(PostController.updateMemberInProject);

export default postRouter;