//routes folder is responsible for defining the routes

import express from "express";
import AuthController from "../controllers/auth.controller.js";
import authenticateUserMiddleware from "../middlewares/authenticate.middleware.js";

const authRouter = express.Router();
authRouter.route("/signup").post(AuthController.signup);
authRouter.route("/login").post(AuthController.login);
authRouter.route("/generateOtp").post(AuthController.generateOtp);
authRouter.route("/changePassword").post(AuthController.changePassword);

authRouter.use(authenticateUserMiddleware);

// only logged in user can access this
authRouter.route("/getLoginDetail").post(AuthController.getLoginDetail);
authRouter.route("/logout").post(AuthController.logout);

export default authRouter;
