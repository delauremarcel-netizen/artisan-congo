import React from 'react';
import ChatbotWidget from '@/components/ChatbotWidget.jsx';

const ChatbotLayout = ({ children }) => {
  return (
    <>
      {children}
      <ChatbotWidget />
    </>
  );
};

export default ChatbotLayout;