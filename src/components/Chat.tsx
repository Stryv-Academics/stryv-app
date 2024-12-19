"use client";

import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import Pusher from "pusher-js";
import { triggerPusherEvent } from "@/services/sendMessage";

Pusher.logToConsole = true;

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

interface ChatComponentProps {
    initialMessages: {
        User: {
            name: string | null;
        };
        message: string;
    }[];
}

export default function Chat({ initialMessages }: ChatComponentProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
        });

        const channel = pusher.subscribe("stryv-test-development");
        channel.bind("new-message", (data: any) => {
            console.log("New message received:", data); // Debug log
            setMessages((prevMessages) => [
                ...prevMessages,
                { User: { name: data.sender_id }, message: data.content },
            ]);
        });

        // Cleanup on component unmount
        /* return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }; */
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const sender_id = "b2630bb4-4f3e-45c6-86c8-c4c24ac38573"; // Replace with dynamic user data if available
    
        try {
            // Insert the new message into Supabase
            const { data, error } = await supabase
                .from("messages")
                .insert([{ sender_id, content: newMessage }]);
    
            if (error) {
                console.error("Error sending message:", error.message);
                return;
            }
    
            // Log the data being sent to Pusher
            const eventData = {
                sender_id,
                content: newMessage,
            };
            console.log("Triggering Pusher event with data:", eventData);
    
            // Trigger Pusher event directly
            await triggerPusherEvent("stryv-test-development", "new-message", eventData);
    
            setNewMessage(""); // Clear the input field
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    return (
        <div className="p-6 flex-grow max-h-screen overflow-y-auto py-32">
            {/* Messages */}
            <div className="flex flex-col gap-4 mb-4">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.User.name || "Anonymous"}:</strong> {msg.message}
                    </div>
                ))}
            </div>

            {/* Chatbox */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow p-2 border rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
