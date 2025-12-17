import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { FaComments, FaPaperPlane, FaUser, FaClock } from 'react-icons/fa';

const AdminChat = () => {
  const { conversations, messages, fetchMessages, sendMessage, loading } = useChat();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      await sendMessage(selectedConversation.id, messageText);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-3xl font-bold">Customer Support Chat</h1>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">Online</span>
        </div>
      </div>

      <div className="flex h-[600px]">
        {/* Conversations List */}
        <div className="w-80 border-r bg-gray-50 overflow-y-auto">
          <div className="p-4 border-b bg-white">
            <h2 className="font-semibold text-gray-700">Conversations</h2>
            <p className="text-xs text-gray-500 mt-1">
              {conversations.length} active chats
            </p>
          </div>

          {loading && conversations.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="loading-spinner"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-20 px-4">
              <FaComments className="text-5xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No conversations yet</p>
              <p className="text-gray-400 text-xs mt-2">
                Customers will appear here when they start chatting
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`w-full p-4 text-left hover:bg-white transition ${
                    selectedConversation?.id === conversation.id ? 'bg-white border-l-4 border-red-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {conversation.user_name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <FaClock className="mr-1" />
                          {formatTime(conversation.last_message_time)}
                        </p>
                      </div>
                    </div>
                    {conversation.unread_count > 0 && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                  {conversation.last_message && (
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.last_message}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Select a conversation to start</p>
                <p className="text-gray-400 text-sm mt-2">
                  Choose a customer from the list to view messages
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white flex items-center space-x-3">
                <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center">
                  <FaUser className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedConversation.user_name}</h3>
                  <p className="text-xs text-gray-500">User ID: {selectedConversation.user_id}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <p className="text-sm">No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-4 ${
                          msg.sender_role === 'admin'
                            ? 'bg-red-600 text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        {msg.sender_role !== 'admin' && (
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            {msg.sender_name}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p
                          className={`text-xs mt-2 ${
                            msg.sender_role === 'admin' ? 'text-red-200' : 'text-gray-400'
                          }`}
                        >
                          {formatMessageTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center space-x-2 font-medium"
                  >
                    <FaPaperPlane />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;




