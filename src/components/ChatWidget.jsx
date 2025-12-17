import { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { conversations, messages, unreadCount, fetchMessages, sendMessage, createConversation } = useChat();
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      if (conversations.length === 0) {
        // Create conversation if not exists
        handleCreateConversation();
      } else if (conversations.length > 0) {
        const myConversation = conversations[0];
        if (myConversation.id !== currentConversationId) {
          setCurrentConversationId(myConversation.id);
          fetchMessages(myConversation.id);
        }
      }
    }
  }, [isOpen, conversations]);

  const handleCreateConversation = async () => {
    try {
      const conv = await createConversation();
      if (conv && conv.id) {
        setCurrentConversationId(conv.id);
        fetchMessages(conv.id);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentConversationId) return;

    try {
      await sendMessage(currentConversationId, message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all z-50 flex items-center justify-center"
      >
        {isOpen ? (
          <FaTimes className="text-2xl" />
        ) : (
          <>
            <FaComments className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-red-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">Customer Support</h3>
                <p className="text-xs opacity-90">We're here to help!</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-red-700 p-2 rounded transition"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <FaComments className="text-4xl mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start a conversation!</p>
                <p className="text-xs mt-1">We typically reply within minutes</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_role === 'admin' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      msg.sender_role === 'admin'
                        ? 'bg-white border border-gray-200'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {msg.sender_role === 'admin' && (
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        {msg.sender_name}
                      </p>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender_role === 'admin' ? 'text-gray-400' : 'text-red-200'
                      }`}
                    >
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;



