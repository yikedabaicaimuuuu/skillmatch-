import React, { useState, useEffect, useRef } from 'react';
import './PrivateChat.css';
import { Avatar, Button, Badge } from 'antd';
import ChatBubble from './ChatBubble';
import SocketService from '../services/socket.service';
import MessageService from '../services/message.service';
import { useSelector } from 'react-redux';

const PrivateChat = ({ user, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentUserId = useSelector((state) => state.user.data?.id);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load message history and set up socket listeners
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const response = await MessageService.getPrivateMessages(user.id);
        if (response.status === 'success') {
          const formattedMessages = response.data.map(msg => ({
            id: msg.id,
            text: msg.content,
            isSender: msg.senderId === currentUserId,
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            }),
            senderName: msg.senderName
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Connect socket if not connected
    if (!SocketService.isConnected()) {
      SocketService.connect();
    }

    // Set up socket event listeners
    const handlePrivateMessage = (data) => {
      if (data.senderId === user.id || data.senderId === currentUserId) {
        setMessages(prev => [...prev, {
          id: data.id,
          text: data.content,
          isSender: data.senderId === currentUserId,
          time: new Date(data.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          senderName: data.senderName
        }]);
      }
    };

    const handleTyping = (data) => {
      if (data.userId === user.id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = (data) => {
      if (data.userId === user.id) {
        setIsTyping(false);
      }
    };

    const handleUserStatus = (data) => {
      if (data.userId === user.id) {
        setIsOnline(data.isOnline);
      }
    };

    SocketService.on('private_message', handlePrivateMessage);
    SocketService.on('user_typing', handleTyping);
    SocketService.on('user_stop_typing', handleStopTyping);
    SocketService.on('user_status', handleUserStatus);

    // Cleanup
    return () => {
      SocketService.off('private_message', handlePrivateMessage);
      SocketService.off('user_typing', handleTyping);
      SocketService.off('user_stop_typing', handleStopTyping);
      SocketService.off('user_status', handleUserStatus);
    };
  }, [user.id, currentUserId]);

  // Handle sending message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    SocketService.sendPrivateMessage(user.id, inputValue.trim());

    // Clear input
    setInputValue('');

    // Stop typing indicator
    SocketService.sendStopTyping(user.id);
  };

  // Handle input change with typing indicator
  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    // Send typing indicator
    SocketService.sendTyping(user.id);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      SocketService.sendStopTyping(user.id);
    }, 1000);
  };

  // Handle enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="private-chat">
      <div className="chat-header">
        <Button type="link" onClick={onClose} className="back-button">
          ←
        </Button>
        <Badge dot status={isOnline ? 'success' : 'default'} offset={[-5, 35]}>
          <Avatar src={user.avatar} alt={user.name} className="chat-avatar" />
        </Badge>
        <div className="chat-user-info">
          <h3 className="chat-user-name">{user.name}</h3>
          <span className="chat-user-status">
            {isTyping ? 'typing...' : isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="chat-messages">
        {loading ? (
          <div className="loading-messages">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatBubble
              key={msg.id || index}
              text={msg.text}
              isSender={msg.isSender}
              time={msg.time}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <Button
          type="primary"
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default PrivateChat;
