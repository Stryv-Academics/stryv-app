"use client";

import Image from "next/image";
import { useState } from "react";
import { Send, Search, Clock, ChevronLeft } from "lucide-react";

// Define types for our chat data
interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isTutor: boolean;
}

interface ChatData {
  messages: Message[];
}

interface Chats {
  [key: number]: ChatData;
}

const MessagingInterface = () => {
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState(0);

  const conversations = [
    {
      id: 1,
      name: "Sarah Miller",
      role: "Math Tutor",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Let's review the calculus homework",
      time: "2:30 PM",
      unread: 1,
    },
    {
      id: 2,
      name: "James Wilson",
      role: "Physics Tutor",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Great progress on the lab report!",
      time: "Yesterday",
      unread: 1,
    },
  ];

  const chats: Chats = {
    1: {
      messages: [
        {
          id: 1,
          sender: "Sarah Miller",
          content: "Hi! How's the preparation for next week's test going?",
          time: "2:25 PM",
          isTutor: true,
        },
        {
          id: 2,
          sender: "Me",
          content:
            "I'm working through the practice problems you sent. Having some trouble with derivatives.",
          time: "2:28 PM",
          isTutor: false,
        },
        {
          id: 3,
          sender: "Sarah Miller",
          content:
            "Let's review the calculus homework and focus on derivatives. Would you like to schedule an extra session?",
          time: "2:30 PM",
          isTutor: true,
        },
      ],
    },
    2: {
      messages: [
        {
          id: 1,
          sender: "James Wilson",
          content: "Hi Zach! How's it going?",
          time: "2:25 PM",
          isTutor: true,
        },
        {
          id: 2,
          sender: "Me",
          content:
            "Good. Could you check up on my lab report and let me know if there are any errors?",
          time: "2:28 PM",
          isTutor: false,
        },
        {
          id: 3,
          sender: "James Wilson",
          content: "Great progress on the lab report!",
          time: "2:30 PM",
          isTutor: true,
        },
      ],
    },
  };

  // Get current active conversation
  const activeConversation = conversations.find(
    (conv) => conv.id === activeChat
  );
  const currentMessages = chats[activeChat]?.messages || [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with conversations */}
      <div className="w-80 border-r bg-white">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-73px)]">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                activeChat === conv.id ? "bg-gray-50" : ""
              }`}
              onClick={() => setActiveChat(conv.id)}
            >
              <div className="flex items-center">
                <Image
                  src="/avatar.png"
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1 ml-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{conv.name}</h3>
                      {conv.unread > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{conv.time}</span>
                  </div>
                  <p className="text-sm text-gray-500">{conv.role}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b bg-white flex items-center gap-4">
          <button className="md:hidden">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <Image
            src="/avatar.png"
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h2 className="font-semibold">{activeConversation?.name}</h2>
            <p className="text-sm text-gray-500">{activeConversation?.role}</p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isTutor ? "" : "justify-end"}`}
            >
              <div
                className={`max-w-[70%] ${
                  msg.isTutor ? "bg-white" : "bg-blue-600 text-white"
                } rounded-2xl p-4 shadow-sm`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{msg.sender}</span>
                  <span className="text-xs opacity-75">{msg.time}</span>
                </div>
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              onClick={() => {
                /* Add send message logic */
                setMessage("");
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;
