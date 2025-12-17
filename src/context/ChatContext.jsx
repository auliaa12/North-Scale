import { createContext, useContext, useState, useEffect } from 'react';
import { chatAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, admin } = useAuth();

  const fetchConversations = async () => {
    try {
      setLoading(true);
      let response;
      
      // For admin, get all conversations
      if (admin) {
        response = await chatAPI.getConversations();
      } 
      // For logged in user, filter by user_id
      else if (user) {
        response = await chatAPI.getConversations(user.id);
      }
      // For guest users, use session_id
      else {
        const { getSessionId } = await import('../services/localStorage');
        const sessionId = getSessionId();
        response = await chatAPI.getConversations(null, sessionId);
      }
      
      setConversations(response.data);
      
      // Count unread messages
      const unread = response.data.reduce((count, conv) => {
        return count + (conv.unread_count || 0);
      }, 0);
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await chatAPI.getMessages(conversationId);
      setMessages(response.data);
      setCurrentConversation(conversationId);
      
      // Mark as read
      await chatAPI.markAsRead(conversationId);
      fetchConversations(); // Refresh unread count
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (conversationId, message) => {
    try {
      const senderId = admin ? `admin_${admin.id}` : `user_${user?.id || 'guest'}`;
      const senderName = admin ? admin.name : (user?.name || 'Guest');
      const senderRole = admin ? 'admin' : 'user';

      await chatAPI.sendMessage(conversationId, {
        message,
        sender_id: senderId,
        sender_name: senderName,
        sender_role: senderRole
      });

      // Refresh messages
      fetchMessages(conversationId);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const createConversation = async () => {
    try {
      let userId = null;
      let userName = 'Guest User';
      let sessionId = null;

      if (user) {
        userId = user.id;
        userName = user.name;
      } else if (admin) {
        // Admin doesn't need to create conversation
        return null;
      } else {
        // Guest user - use session_id
        const { getSessionId } = await import('../services/localStorage');
        sessionId = getSessionId();
      }

      const response = await chatAPI.createConversation(userId, userName, sessionId);
      fetchConversations();
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Always allow chat access, even for guests
    fetchConversations();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [user, admin]);

  const value = {
    conversations,
    messages,
    currentConversation,
    unreadCount,
    loading,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};



