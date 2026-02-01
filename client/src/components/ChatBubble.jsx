import React from 'react';
import './ChatBubble.css';

const ChatBubble = ({ text, isSender, time }) => (
  <div className={`chat-bubble-container ${isSender ? 'align-right' : 'align-left'}`}>
    <div className={`chat-bubble ${isSender ? 'sent' : 'received'}`}>
      <p>{text}</p>
      <span className="message-time">{time}</span>
    </div>
  </div>
);

export default ChatBubble;
