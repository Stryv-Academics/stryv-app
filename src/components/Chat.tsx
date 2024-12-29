"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { triggerPusherEvent } from "@/services/triggerPusherEvent";
import Pusher from "pusher-js";

const supabase = createClient();

interface MessageProp {
    id: string | null;
    conversation_id: string | null;
    content: string | null;
    message_type: string | null;
    attachment_url: string | null;
    created_at: string | null;
    sender_id: string | null;
    first_name: string | null;
}

interface ChatProps {
    initialMessages: MessageProp[];
    conversation_id: any;
}

const formatDateTime = (isoString: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const Chat = ({ initialMessages, conversation_id }: ChatProps) => {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");

    // Pusher setup for real-time updates
    useEffect(() => {
        console.time("Pusher execution time");
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
        });

        const channel = pusher.subscribe("stryv-test-development");
        channel.bind("new-message", (data: any) => {
            setMessages((prevMessages) => [
                ...(prevMessages || []),
                { id: null, conversation_id: conversation_id, content: data.content, message_type: null,
                    attachment_url: null, created_at: data.created_at, sender_id: data.sender_id, first_name: data.first_name },
            ]);
        });
        console.timeEnd("Pusher execution time");

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNewMessage(""); // clear the input field

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("Error fetching user:", userError?.message || "No user found");
            return;
        }

        const { data: profile, error } = await supabase
                .from("accounts")
                .select("first_name")
                .eq("id", user.id);

        try {
            const { data, error } = await supabase
                .from("messages")
                .insert([{ content: newMessage, conversation_id: conversation_id }]);

            if (error) {
                console.error("Error sending message:", error.message);
                return;
            }

            const eventData = {
                sender_id: user.id,
                content: newMessage,
                first_name: profile?.[0]?.first_name,
                created_at: formatDateTime(new Date().toISOString()),
            };

            await triggerPusherEvent("stryv-test-development", "new-message", eventData);

        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-4 mb-4">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg?.first_name || "Anonymous"}:</strong> {msg?.content || ""}
                        <i className="block text-sm text-gray-500">{msg?.created_at ? formatDateTime(msg.created_at) : ""}</i>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow p-2 border rounded"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chat;