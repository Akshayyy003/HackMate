'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Users,
  Hash,
  Plus,
  Phone,
  Video,
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

interface Conversation {
  id: string;
  name: string;
  type: 'direct' | 'team';
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  isOnline?: boolean;
  members?: string[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'AI Innovation Squad',
    type: 'team',
    avatar: '🤖',
    lastMessage: {
      id: '1',
      senderId: '2',
      senderName: 'Sarah Kim',
      content: 'Great progress on the UI mockups! Ready for review.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'text',
    },
    unreadCount: 2,
    members: ['1', '2', '3'],
  },
  {
    id: '2',
    name: 'Sarah Kim',
    type: 'direct',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastMessage: {
      id: '2',
      senderId: '2',
      senderName: 'Sarah Kim',
      content: 'Hey! Want to pair on the frontend components?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text',
    },
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: '3',
    name: 'Green Tech Warriors',
    type: 'team',
    avatar: '🌱',
    lastMessage: {
      id: '3',
      senderId: '4',
      senderName: 'Emma Davis',
      content: 'Meeting starts in 15 minutes!',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: 'text',
    },
    unreadCount: 1,
    members: ['1', '4'],
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Sarah Kim',
    senderAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    content: 'Hey team! I\'ve finished the initial wireframes for our AI project.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'text',
  },
  {
    id: '2',
    senderId: '1',
    senderName: 'Alex Chen',
    content: 'Awesome work! The user flow looks really intuitive.',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    type: 'text',
  },
  {
    id: '3',
    senderId: '3',
    senderName: 'Mike Johnson',
    senderAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
    content: 'I\'ve got the ML model training. Should have initial results by tomorrow.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    type: 'text',
  },
  {
    id: '4',
    senderId: '2',
    senderName: 'Sarah Kim',
    senderAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    content: 'Great progress on the UI mockups! Ready for review.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    type: 'text',
  },
];

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(mockConversations[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: user?.id || '1',
        senderName: user?.name || 'You',
        senderAvatar: user?.avatar,
        content: messageInput.trim(),
        timestamp: new Date(),
        type: 'text',
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Messages</span>
                </h2>
                <Button size="sm" variant="ghost">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredConversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                      selectedConversation.id === conversation.id
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {conversation.type === 'team' ? (
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {conversation.avatar}
                          </div>
                        ) : (
                          <>
                            <img
                              src={conversation.avatar}
                              alt={conversation.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            {conversation.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {conversation.name}
                          </h3>
                          {conversation.type === 'team' && (
                            <Users className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {conversation.lastMessage.senderName}: {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-blue-500 text-white text-xs px-2 py-0">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedConversation.type === 'team' ? (
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedConversation.avatar}
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={selectedConversation.avatar}
                        alt={selectedConversation.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {selectedConversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                      )}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <span>{selectedConversation.name}</span>
                      {selectedConversation.type === 'team' && (
                        <Users className="w-4 h-4 text-gray-400" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedConversation.type === 'team' 
                        ? `${selectedConversation.members?.length} members`
                        : selectedConversation.isOnline ? 'Online' : 'Offline'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {selectedConversation.type === 'direct' && (
                    <>
                      <Button size="sm" variant="ghost">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Video className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => {
                    const isOwn = message.senderId === user?.id;
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {!isOwn && (
                            <img
                              src={message.senderAvatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'}
                              alt={message.senderName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              isOwn
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            {!isOwn && selectedConversation.type === 'team' && (
                              <p className="text-xs font-medium mb-1 opacity-75">
                                {message.senderName}
                              </p>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Message Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="flex space-x-2">
                <Input
                  placeholder={`Message ${selectedConversation.name}...`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}