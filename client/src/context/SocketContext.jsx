/**
 * Socket Context Provider
 * Manages global WebSocket connection state
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SocketService from '../services/socket.service';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userId = useSelector((state) => state.user.data?.id);

  useEffect(() => {
    if (isAuthenticated && userId) {
      // Connect to socket
      const socket = SocketService.connect();

      // Authenticate with user ID
      SocketService.authenticate(userId);

      // Set up connection listeners
      socket.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected in context');
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected in context');
      });

      // Handle notifications
      socket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      // Handle private messages for unread count
      socket.on('private_message', (data) => {
        if (data.senderId !== userId) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      return () => {
        SocketService.disconnect();
      };
    }
  }, [isAuthenticated, userId]);

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const markAsRead = () => {
    setUnreadCount(0);
  };

  const value = {
    isConnected,
    notifications,
    unreadCount,
    clearNotifications,
    markAsRead,
    sendPrivateMessage: SocketService.sendPrivateMessage.bind(SocketService),
    sendProjectMessage: SocketService.sendProjectMessage.bind(SocketService),
    joinProject: SocketService.joinProject.bind(SocketService),
    leaveProject: SocketService.leaveProject.bind(SocketService),
    on: SocketService.on.bind(SocketService),
    off: SocketService.off.bind(SocketService)
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
