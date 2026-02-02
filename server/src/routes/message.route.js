import { Router } from "express";
import MessageController from "../controllers/message.controller.js";
import authMiddleware from "../middlewares/authenticate.middleware.js";

const messageRouter = Router();

/**
 * @swagger
 * /api/messages/conversations:
 *   get:
 *     summary: Get all conversations for the authenticated user
 *     tags: [Messages]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *       401:
 *         description: Authentication required
 */
messageRouter.get("/conversations", authMiddleware, MessageController.getConversations);

/**
 * @swagger
 * /api/messages/private/{userId}:
 *   get:
 *     summary: Get messages with a specific user
 *     tags: [Messages]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of messages
 *       401:
 *         description: Authentication required
 */
messageRouter.get("/private/:userId", authMiddleware, MessageController.getPrivateMessages);

/**
 * @swagger
 * /api/messages/project/{projectId}:
 *   get:
 *     summary: Get messages for a project
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of project messages
 */
messageRouter.get("/project/:projectId", MessageController.getProjectMessages);

/**
 * @swagger
 * /api/messages/unread:
 *   get:
 *     summary: Get unread message count
 *     tags: [Messages]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Unread count
 *       401:
 *         description: Authentication required
 */
messageRouter.get("/unread", authMiddleware, MessageController.getUnreadCount);

/**
 * @swagger
 * /api/messages/read/{senderId}:
 *   post:
 *     summary: Mark messages from a sender as read
 *     tags: [Messages]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: senderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Messages marked as read
 *       401:
 *         description: Authentication required
 */
messageRouter.post("/read/:senderId", authMiddleware, MessageController.markAsRead);

/**
 * @swagger
 * /api/messages/online:
 *   get:
 *     summary: Get list of online users
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: List of online user IDs
 */
messageRouter.get("/online", MessageController.getOnlineUsers);

export default messageRouter;
