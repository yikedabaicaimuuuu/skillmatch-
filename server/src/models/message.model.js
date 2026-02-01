/**
 * Message Model
 * Database operations for chat messages
 */

import pool from "../configs/db.js";
import errorThrower from "../helper/errorThrower.js";

class MessageModel {
  /**
   * Create the message table if not exists
   */
  async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS "message" (
        "id" SERIAL PRIMARY KEY,
        "senderId" INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "recipientId" INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
        "projectId" INTEGER REFERENCES "post"(id) ON DELETE CASCADE,
        "content" TEXT NOT NULL,
        "type" VARCHAR(20) NOT NULL DEFAULT 'private',
        "isRead" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (
          ("type" = 'private' AND "recipientId" IS NOT NULL) OR
          ("type" = 'project' AND "projectId" IS NOT NULL)
        )
      );

      CREATE INDEX IF NOT EXISTS "idx_message_sender" ON "message"("senderId");
      CREATE INDEX IF NOT EXISTS "idx_message_recipient" ON "message"("recipientId");
      CREATE INDEX IF NOT EXISTS "idx_message_project" ON "message"("projectId");
      CREATE INDEX IF NOT EXISTS "idx_message_created" ON "message"("createdAt");
    `;

    try {
      await pool.query(sql);
      console.log("Message table created/verified");
    } catch (error) {
      console.error("Error creating message table:", error);
    }
  }

  /**
   * Get conversation list for a user
   */
  async getConversations(userId) {
    try {
      const sql = `
        WITH last_messages AS (
          SELECT DISTINCT ON (
            LEAST("senderId", "recipientId"),
            GREATEST("senderId", "recipientId")
          )
            m.*,
            CASE
              WHEN m."senderId" = $1 THEN m."recipientId"
              ELSE m."senderId"
            END as "otherUserId"
          FROM "message" m
          WHERE m."type" = 'private'
            AND (m."senderId" = $1 OR m."recipientId" = $1)
          ORDER BY
            LEAST("senderId", "recipientId"),
            GREATEST("senderId", "recipientId"),
            m."createdAt" DESC
        )
        SELECT
          lm.*,
          u."fullName" as "otherUserName",
          u."email" as "otherUserEmail",
          (
            SELECT COUNT(*)
            FROM "message"
            WHERE "recipientId" = $1
              AND "senderId" = lm."otherUserId"
              AND "isRead" = FALSE
          ) as "unreadCount"
        FROM last_messages lm
        INNER JOIN "user" u ON u.id = lm."otherUserId"
        ORDER BY lm."createdAt" DESC
      `;

      const result = await pool.query(sql, [userId]);
      return result.rows;
    } catch (error) {
      console.error("Error getting conversations:", error);
      throw errorThrower(500, "Error retrieving conversations");
    }
  }

  /**
   * Get messages between two users
   */
  async getPrivateMessages(userId1, userId2, limit = 50, offset = 0) {
    try {
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
        LIMIT $3 OFFSET $4
      `;

      const result = await pool.query(sql, [userId1, userId2, limit, offset]);
      return result.rows.reverse();
    } catch (error) {
      console.error("Error getting private messages:", error);
      throw errorThrower(500, "Error retrieving messages");
    }
  }

  /**
   * Get messages for a project
   */
  async getProjectMessages(projectId, limit = 50, offset = 0) {
    try {
      const sql = `
        SELECT m.*, u."fullName" as "senderName"
        FROM "message" m
        INNER JOIN "user" u ON m."senderId" = u.id
        WHERE m."projectId" = $1 AND m."type" = 'project'
        ORDER BY m."createdAt" DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await pool.query(sql, [projectId, limit, offset]);
      return result.rows.reverse();
    } catch (error) {
      console.error("Error getting project messages:", error);
      throw errorThrower(500, "Error retrieving project messages");
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(userId, senderId) {
    try {
      const sql = `
        UPDATE "message"
        SET "isRead" = TRUE, "updatedAt" = CURRENT_TIMESTAMP
        WHERE "recipientId" = $1 AND "senderId" = $2 AND "isRead" = FALSE
        RETURNING *
      `;

      const result = await pool.query(sql, [userId, senderId]);
      return result.rows;
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw errorThrower(500, "Error updating messages");
    }
  }

  /**
   * Get unread message count for a user
   */
  async getUnreadCount(userId) {
    try {
      const sql = `
        SELECT COUNT(*) as count
        FROM "message"
        WHERE "recipientId" = $1 AND "isRead" = FALSE AND "type" = 'private'
      `;

      const result = await pool.query(sql, [userId]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }
}

export default new MessageModel();
