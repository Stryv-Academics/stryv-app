"use client";

import React from "react";
import {
    MessageSquare,
    Search,
    Clock,
    Send,
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ConversationMessage {
    id: number;
    sender: string;
    content: string;
    time: string;
}

interface Message {
    id: number;
    sender: string;
    preview: string;
    time: string;
    unread: boolean;
    conversation: ConversationMessage[];
}

export default function MessagesPage() {
    const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null);
    const [newMessage, setNewMessage] = React.useState("");
    const [readMessages, setReadMessages] = React.useState<Set<number>>(new Set());

    const messages: Message[] = [
        {
            id: 1,
            sender: "Sarah Miller",
            preview: "When would you like to...",
            time: "2:30 PM",
            unread: true,
            conversation: [
                {
                    id: 1,
                    sender: "Sarah Miller",
                    content: "You're welcome! Let me know if you need any clarification.",
                    time: "2:30 PM",
                },
                {
                    id: 2,
                    sender: "You",
                    content: "Thanks for the feedback on my last assignment! I've made the suggested changes.",
                    time: "2:35 PM",
                },
                {
                    id: 3,
                    sender: "Sarah Miller",
                    content: "When would you like to meet next?",
                    time: "2:36 PM",
                },
            ],
        },
        {
            id: 2,
            sender: "Guy Berryman",
            preview: "Remember to check Coldplay out at...",
            time: "2:30 PM",
            unread: true,
            conversation: [
                {
                    id: 1,
                    sender: "Sarah Miller",
                    content: "Remember to check Coldplay out at LA in 2025!",
                    time: "2:30 PM",
                },
                {
                    id: 2,
                    sender: "You",
                    content: "I'll do my best to find tickets that don't cost an arm and a leg.",
                    time: "2:35 PM",
                },
            ],
        },
        {
            id: 3,
            sender: "John Davis",
            preview: "When would you be available for our next session?",
            time: "11:15 AM",
            unread: false,
            conversation: [
                {
                    id: 1,
                    sender: "John Davis",
                    content: "When would you be available for our next session?",
                    time: "11:15 AM",
                },
            ],
        },
    ];

    const handleMessageClick = (message: Message) => {
        setSelectedMessage(message);
        setReadMessages((prev) => new Set([...prev, message.id]));
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setNewMessage("");
        }
    };

    return (
        <div className="max-w-full h-screen mx-auto p-6 bg-white flex flex-col">
            <Card className="shadow-sm rounded-lg flex-1 overflow-hidden">
                <div className="h-full flex flex-col">
                    {!selectedMessage ? (
                        <>
                            <div className="p-6 flex-shrink-0">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-6 h-6 text-blue-600" />
                                        <h1 className="text-xl font-semibold text-gray-900">
                                            Messages
                                        </h1>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="hover:bg-gray-100"
                                    >
                                        <Clock className="w-4 h-4 mr-2" />
                                        Recent
                                    </Button>
                                </div>
                                <div className="relative mb-6">
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <Input
                                        placeholder="Search messages..."
                                        className="pl-10 w-full bg-white"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        onClick={() => handleMessageClick(message)}
                                        className="p-4 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer bg-white shadow-sm border border-gray-200"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900">
                                                    {message.sender}
                                                </span>
                                                {message.unread && !readMessages.has(message.id) && (
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">{message.time}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm">{message.preview}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center gap-4 p-6">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedMessage(null)}
                                    className="hover:bg-gray-100"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {selectedMessage.sender}
                                </h2>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                                {selectedMessage.conversation.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-lg p-3 ${msg.sender === "You"
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-900"
                                                }`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <span className="text-xs mt-1 block opacity-70">
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 p-6 bg-white">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1"
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
