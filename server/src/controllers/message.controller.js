/**
 * Message Controller
 * HTTP endpoints for messaging features
 */

import MessageModel from "../models/message.model.js";
import SocketService from "../services/socket.service.js";
import errorThrower from "../helper/errorThrower.js";

class MessageController {
  /**
   * Get all conversations for the authenticated user
   * GET /api/messages/conversations
   */
  async getConversations(request, response, next) {
    try {
      const userId = request.session?.userId;

      if (!userId) {
        throw errorThrower(401, "Authentication required");
      }

      const conversations = await MessageModel.getConversations(userId);

      // Add online status
      const conversationsWithStatus = conversations.map(conv => ({
        ...conv,
        isOnline: SocketService.isUserOnline(conv.otherUserId)
      }));

      response.status(200).json({
        status: "success",
        data: conversationsWithStatus
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get messages with a specific user
   * GET /api/messages/private/:userId
   */
  async getPrivateMessages(request, response, next) {
    try {
      const currentUserId = request.session?.userId;
      const { userId: otherUserId } = request.params;
      const { limit = 50, offset = 0 } = request.query;

      if (!currentUserId) {
        throw errorThrower(401, "Authentication required");
      }

      const messages = await MessageModel.getPrivateMessages(
        currentUserId,
        parseInt(otherUserId),
        parseInt(limit),
        parseInt(offset)
      );

      // Mark messages as read
      await MessageModel.markAsRead(currentUserId, parseInt(otherUserId));

      response.status(200).json({
        status: "success",
        data: messages
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get messages for a project
   * GET /api/messages/project/:projectId
   */
  async getProjectMessages(request, response, next) {
    try {
      const { projectId } = request.params;
      const { limit = 50, offset = 0 } = request.query;

      const messages = await MessageModel.getProjectMessages(
        parseInt(projectId),
        parseInt(limit),
        parseInt(offset)
      );

      response.status(200).json({
        status: "success",
        data: messages
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get unread message count
   * GET /api/messages/unread
   */
  async getUnreadCount(request, response, next) {
    try {
      const userId = request.session?.userId;

      if (!userId) {
        throw errorThrower(401, "Authentication required");
      }

      const count = await MessageModel.getUnreadCount(userId);

      response.status(200).json({
        status: "success",
        data: { unreadCount: count }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark messages as read
   * POST /api/messages/read/:senderId
   */
  async markAsRead(request, response, next) {
    try {
      const userId = request.session?.userId;
      const { senderId } = request.params;

      if (!userId) {
        throw errorThrower(401, "Authentication required");
      }

      await MessageModel.markAsRead(userId, parseInt(senderId));

      response.status(200).json({
        status: "success",
        message: "Messages marked as read"
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get online users list
   * GET /api/messages/online
   */
  async getOnlineUsers(request, response, next) {
    try {
      const onlineUsers = SocketService.getOnlineUsers();

      response.status(200).json({
        status: "success",
        data: { onlineUsers, count: onlineUsers.length }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MessageController();
