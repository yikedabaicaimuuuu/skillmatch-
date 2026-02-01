/**
 * Socket.io Client Service
 * Manages WebSocket connections for real-time features
 */

import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  /**
   * Connect to the WebSocket server
   */
  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const serverUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

    this.socket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Authenticate the socket with user ID
   */
  authenticate(userId) {
    if (this.socket) {
      this.socket.emit('authenticate', { userId });
    }
  }

  /**
   * Join a project chat room
   */
  joinProject(projectId) {
    if (this.socket) {
      this.socket.emit('join_project', projectId);
    }
  }

  /**
   * Leave a project chat room
   */
  leaveProject(projectId) {
    if (this.socket) {
      this.socket.emit('leave_project', projectId);
    }
  }

  /**
   * Send a private message
   */
  sendPrivateMessage(recipientId, content) {
    if (this.socket) {
      this.socket.emit('private_message', { recipientId, content });
    }
  }

  /**
   * Send a project message
   */
  sendProjectMessage(projectId, content) {
    if (this.socket) {
      this.socket.emit('project_message', { projectId, content });
    }
  }

  /**
   * Send typing indicator
   */
  sendTyping(recipientId = null, projectId = null) {
    if (this.socket) {
      this.socket.emit('typing', { recipientId, projectId });
    }
  }

  /**
   * Send stop typing indicator
   */
  sendStopTyping(recipientId = null, projectId = null) {
    if (this.socket) {
      this.socket.emit('stop_typing', { recipientId, projectId });
    }
  }

  /**
   * Subscribe to an event
   */
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);

      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  /**
   * Unsubscribe from an event
   */
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);

      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    }
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
    }
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export default new SocketService();
