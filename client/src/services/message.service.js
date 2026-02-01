/**
 * Message API Service
 * Client-side service for messaging features
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class MessageService {
  /**
   * Get all conversations for the current user
   */
  async getConversations() {
    try {
      const response = await fetch(`${API_URL}/messages/conversations`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get conversations');
      }

      return data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  /**
   * Get messages with a specific user
   */
  async getPrivateMessages(userId, limit = 50, offset = 0) {
    try {
      const response = await fetch(
        `${API_URL}/messages/private/${userId}?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get messages');
      }

      return data;
    } catch (error) {
      console.error('Error fetching private messages:', error);
      throw error;
    }
  }

  /**
   * Get messages for a project
   */
  async getProjectMessages(projectId, limit = 50, offset = 0) {
    try {
      const response = await fetch(
        `${API_URL}/messages/project/${projectId}?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get project messages');
      }

      return data;
    } catch (error) {
      console.error('Error fetching project messages:', error);
      throw error;
    }
  }

  /**
   * Get unread message count
   */
  async getUnreadCount() {
    try {
      const response = await fetch(`${API_URL}/messages/unread`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get unread count');
      }

      return data.data.unreadCount;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(senderId) {
    try {
      const response = await fetch(`${API_URL}/messages/read/${senderId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark messages as read');
      }

      return data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  /**
   * Get online users
   */
  async getOnlineUsers() {
    try {
      const response = await fetch(`${API_URL}/messages/online`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get online users');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching online users:', error);
      return { onlineUsers: [], count: 0 };
    }
  }
}

export default new MessageService();
