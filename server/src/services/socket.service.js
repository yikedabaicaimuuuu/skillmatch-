/**
 * WebSocket Service using Socket.io
 *
 * Provides real-time communication features:
 * - Private messaging between users
 * - Project chat rooms
 * - Real-time notifications
 * - Online presence tracking
 */

import { Server } from "socket.io";
import pool from "../configs/db.js";

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId mapping
    this.userSockets = new Map(); // socketId -> userId mapping
  }

  /**
   * Initialize Socket.io with the HTTP server
   */
  initialize(httpServer, sessionMiddleware) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });

    // Share session with socket.io
    this.io.engine.use(sessionMiddleware);

    this.io.on("connection", (socket) => {
      this.handleConnection(socket);
    });

    console.log("Socket.io initialized");
    return this.io;
  }

  /**
   * Handle new socket connection
   */
  handleConnection(socket) {
    const session = socket.request.session;
    const userId = session?.userId;

    console.log(`Socket connected: ${socket.id}, User: ${userId || 'anonymous'}`);

    if (userId) {
      this.registerUser(socket, userId);
    }

    // Event handlers
    socket.on("authenticate", (data) => this.handleAuthenticate(socket, data));
    socket.on("join_project", (projectId) => this.handleJoinProject(socket, projectId));
    socket.on("leave_project", (projectId) => this.handleLeaveProject(socket, projectId));
    socket.on("private_message", (data) => this.handlePrivateMessage(socket, data));
    socket.on("project_message", (data) => this.handleProjectMessage(socket, data));
    socket.on("typing", (data) => this.handleTyping(socket, data));
    socket.on("stop_typing", (data) => this.handleStopTyping(socket, data));
    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  /**
   * Register a user's socket connection
   */
  registerUser(socket, userId) {
    // Store mappings
    this.connectedUsers.set(userId.toString(), socket.id);
    this.userSockets.set(socket.id, userId.toString());

    // Join personal room for targeted notifications
    socket.join(`user:${userId}`);

    // Broadcast online status to friends/connections
    this.broadcastOnlineStatus(userId, true);

    console.log(`User ${userId} registered with socket ${socket.id}`);
  }

  /**
   * Handle manual authentication (for clients that connect before session)
   */
  handleAuthenticate(socket, { userId }) {
    if (userId) {
      this.registerUser(socket, userId);
      socket.emit("authenticated", { success: true, userId });
    }
  }

  /**
   * Handle joining a project chat room
   */
  async handleJoinProject(socket, projectId) {
    const userId = this.userSockets.get(socket.id);

    if (!userId) {
      socket.emit("error", { message: "Authentication required" });
      return;
    }

    const roomName = `project:${projectId}`;
    socket.join(roomName);

    // Notify others in the room
    socket.to(roomName).emit("user_joined", {
      projectId,
      userId,
      timestamp: new Date().toISOString()
    });

    // Send recent messages
    const messages = await this.getProjectMessages(projectId, 50);
    socket.emit("project_history", { projectId, messages });

    console.log(`User ${userId} joined project room ${projectId}`);
  }

  /**
   * Handle leaving a project chat room
   */
  handleLeaveProject(socket, projectId) {
    const userId = this.userSockets.get(socket.id);
    const roomName = `project:${projectId}`;

    socket.leave(roomName);

    socket.to(roomName).emit("user_left", {
      projectId,
      userId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle private message between users
   */
  async handlePrivateMessage(socket, { recipientId, content }) {
    const senderId = this.userSockets.get(socket.id);

    if (!senderId) {
      socket.emit("error", { message: "Authentication required" });
      return;
    }

    if (!recipientId || !content?.trim()) {
      socket.emit("error", { message: "Recipient and content are required" });
      return;
    }

    try {
      // Save message to database
      const message = await this.savePrivateMessage(senderId, recipientId, content);

      // Get sender info
      const senderInfo = await this.getUserInfo(senderId);

      const messageData = {
        id: message.id,
        senderId,
        senderName: senderInfo?.fullName || 'Unknown',
        recipientId,
        content: content.trim(),
        timestamp: message.createdAt,
        type: 'private'
      };

      // Send to recipient if online
      const recipientSocketId = this.connectedUsers.get(recipientId.toString());
      if (recipientSocketId) {
        this.io.to(recipientSocketId).emit("private_message", messageData);
      }

      // Confirm to sender
      socket.emit("message_sent", messageData);

    } catch (error) {
      console.error("Error sending private message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  }

  /**
   * Handle project chat message
   */
  async handleProjectMessage(socket, { projectId, content }) {
    const senderId = this.userSockets.get(socket.id);

    if (!senderId) {
      socket.emit("error", { message: "Authentication required" });
      return;
    }

    if (!projectId || !content?.trim()) {
      socket.emit("error", { message: "Project ID and content are required" });
      return;
    }

    try {
      // Save message to database
      const message = await this.saveProjectMessage(projectId, senderId, content);

      // Get sender info
      const senderInfo = await this.getUserInfo(senderId);

      const messageData = {
        id: message.id,
        projectId,
        senderId,
        senderName: senderInfo?.fullName || 'Unknown',
        content: content.trim(),
        timestamp: message.createdAt,
        type: 'project'
      };

      // Broadcast to project room
      this.io.to(`project:${projectId}`).emit("project_message", messageData);

    } catch (error) {
      console.error("Error sending project message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  }

  /**
   * Handle typing indicator
   */
  handleTyping(socket, { recipientId, projectId }) {
    const senderId = this.userSockets.get(socket.id);

    if (recipientId) {
      // Private chat typing
      const recipientSocketId = this.connectedUsers.get(recipientId.toString());
      if (recipientSocketId) {
        this.io.to(recipientSocketId).emit("user_typing", { userId: senderId });
      }
    } else if (projectId) {
      // Project chat typing
      socket.to(`project:${projectId}`).emit("user_typing", {
        userId: senderId,
        projectId
      });
    }
  }

  /**
   * Handle stop typing indicator
   */
  handleStopTyping(socket, { recipientId, projectId }) {
    const senderId = this.userSockets.get(socket.id);

    if (recipientId) {
      const recipientSocketId = this.connectedUsers.get(recipientId.toString());
      if (recipientSocketId) {
        this.io.to(recipientSocketId).emit("user_stop_typing", { userId: senderId });
      }
    } else if (projectId) {
      socket.to(`project:${projectId}`).emit("user_stop_typing", {
        userId: senderId,
        projectId
      });
    }
  }

  /**
   * Handle socket disconnection
   */
  handleDisconnect(socket) {
    const userId = this.userSockets.get(socket.id);

    if (userId) {
      this.connectedUsers.delete(userId);
      this.userSockets.delete(socket.id);
      this.broadcastOnlineStatus(userId, false);
    }

    console.log(`Socket disconnected: ${socket.id}`);
  }

  /**
   * Broadcast online status to relevant users
   */
  broadcastOnlineStatus(userId, isOnline) {
    this.io.emit("user_status", {
      userId,
      isOnline,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send notification to specific user
   */
  sendNotification(userId, notification) {
    const socketId = this.connectedUsers.get(userId.toString());

    if (socketId) {
      this.io.to(socketId).emit("notification", {
        ...notification,
        timestamp: new Date().toISOString()
      });
      return true;
    }
    return false;
  }

  /**
   * Send notification to all project members
   */
  sendProjectNotification(projectId, notification) {
    this.io.to(`project:${projectId}`).emit("notification", {
      ...notification,
      projectId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId) {
    return this.connectedUsers.has(userId.toString());
  }

  /**
   * Get list of online users
   */
  getOnlineUsers() {
    return Array.from(this.connectedUsers.keys());
  }

  // Database operations

  async savePrivateMessage(senderId, recipientId, content) {
    const sql = `
      INSERT INTO "message" ("senderId", "recipientId", "content", "type")
      VALUES ($1, $2, $3, 'private')
      RETURNING *
    `;
    const result = await pool.query(sql, [senderId, recipientId, content.trim()]);
    return result.rows[0];
  }

  async saveProjectMessage(projectId, senderId, content) {
    const sql = `
      INSERT INTO "message" ("projectId", "senderId", "content", "type")
      VALUES ($1, $2, $3, 'project')
      RETURNING *
    `;
    const result = await pool.query(sql, [projectId, senderId, content.trim()]);
    return result.rows[0];
  }

  async getProjectMessages(projectId, limit = 50) {
    const sql = `
      SELECT m.*, u."fullName" as "senderName"
      FROM "message" m
      INNER JOIN "user" u ON m."senderId" = u.id
      WHERE m."projectId" = $1 AND m."type" = 'project'
      ORDER BY m."createdAt" DESC
      LIMIT $2
    `;
    const result = await pool.query(sql, [projectId, limit]);
    return result.rows.reverse(); // Return in chronological order
  }

  async getPrivateMessages(userId1, userId2, limit = 50) {
    const sql = `
      SELECT m.*, u."fullName" as "senderName"
      FROM "message" m
      INNER JOIN "user" u ON m."senderId" = u.id
      WHERE m."type" = 'private'
        AND (
          (m."senderId" = $1 AND m."recipientId" = $2)
          OR (m."senderId" = $2 AND m."recipientId" = $1)
        )
      ORDER BY m."createdAt" DESC
      LIMIT $3
    `;
    const result = await pool.query(sql, [userId1, userId2, limit]);
    return result.rows.reverse();
  }

  async getUserInfo(userId) {
    const sql = `SELECT id, "fullName", email FROM "user" WHERE id = $1`;
    const result = await pool.query(sql, [userId]);
    return result.rows[0];
  }
}

export default new SocketService();
