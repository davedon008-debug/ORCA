"use client";

import { useEffect, useState, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../../context/AuthContext';
import { Send, User as UserIcon } from 'lucide-react';
import { getBackendUrl } from '../../utils/axiosInstance';

export default function SupportChat() {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io(getBackendUrl());
    setSocket(newSocket);

    newSocket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage.trim() !== '' && socket) {
      const messageData = {
        author: user ? user.name : 'Guest',
        message: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAdmin: user ? user.isAdmin : false
      };
      
      await socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);
      setCurrentMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 h-[calc(100vh-16rem)] min-h-[500px]">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between shadow-md z-10">
          <div>
            <h2 className="text-xl font-bold">Live Support Chat</h2>
            <p className="text-blue-100 text-sm mt-1 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Agents are online
            </p>
          </div>
          <div className="bg-blue-500 p-3 rounded-full">
            <UserIcon size={24} />
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col gap-4">
          <div className="text-center my-4">
            <span className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">Welcome to Orca Support</span>
          </div>
          
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 p-4 rounded-2xl rounded-tl-sm shadow-sm max-w-[80%] border border-gray-100">
              <p className="font-bold text-sm text-blue-600 mb-1">Support Agent</p>
              <p>Hello! How can we help you with your interior design today?</p>
              <span className="text-xs text-gray-400 block mt-2 text-right">Just now</span>
            </div>
          </div>

          {messages.map((msg, index) => {
            const isMe = msg.author === (user ? user.name : 'Guest');
            return (
              <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'} p-4 rounded-2xl shadow-sm max-w-[80%]`}>
                  {!isMe && <p className="font-bold text-sm text-blue-600 mb-1">{msg.author}</p>}
                  <p>{msg.message}</p>
                  <span className={`text-xs ${isMe ? 'text-blue-200' : 'text-gray-400'} block mt-2 text-right`}>{msg.time}</span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Footer */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full px-6 py-3 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!currentMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-full p-3 flex items-center justify-center transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Send size={20} className={currentMessage.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
