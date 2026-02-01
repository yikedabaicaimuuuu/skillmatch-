import dotenv from "dotenv";
dotenv.config();

import express from "express";
import corsMiddleware from "./middlewares/cors.middleware.js";
import authRouter from "./routes/auth.route.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import sessionMiddleware from "./middlewares/session.middleware.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import matchingRouter from "./routes/matching.route.js";
import messageRouter from "./routes/message.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Apply middleware
app.use(corsMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, "../public")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Route definitions
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/matching", matchingRouter);
app.use("/api/messages", messageRouter);

// Error handler middleware
app.use(errorHandlerMiddleware);

export default app;
