//routes folder is responsible for defining the routes

import express from "express";
import UserController from "../controllers/user.controller.js";
import authenticateUserMiddleware from "../middlewares/authenticate.middleware.js";

const userRouter = express.Router();

userRouter.use(authenticateUserMiddleware);

// only logged in user can access this
userRouter.route("/addSkill").post(UserController.addSkill);
userRouter.route("/removeSkill").post(UserController.removeSkill);
userRouter.route("/addInterest").post(UserController.addInterest);
userRouter.route("/removeInterest").post(UserController.removeInterest);

export default userRouter;
