"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Import your client.ts file
import { triggerPusherEvent } from "@/services/sendMessage";
import Pusher from "pusher-js";

const supabase = createClient();

interface ChatComponentProps {
    initialMessages: {
        User: {
            name: string | null;
        };
        message: string;
    }[];
}

export default function Chat({ initialMessages }: ChatComponentProps) {
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
                console.error("Auth session missing or error fetching session:", error);
                return;
            }
            setUser(session.user);
            console.log(session.user.id);
        };

        fetchUser();

        // Pusher setup
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
        });

        const channel = pusher.subscribe("stryv-test-development");
        channel.bind("new-message", (data: any) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { User: { name: data.sender_id }, message: data.content },
            ]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            console.error("User not logged in");
            return;
        }

        const sender_id = user.id; // Use the logged-in user's ID

        try {
            const { data, error } = await supabase
                .from("messages")
                .insert([{ content: newMessage }]);

            if (error) {
                console.error("Error sending message:", error.message);
                return;
            }

            const eventData = {
                sender_id,
                content: newMessage,
            };

            await triggerPusherEvent("stryv-test-development", "new-message", eventData);

            setNewMessage(""); // clear the input field
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-4 mb-4">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.User.name || "Anonymous"}:</strong> {msg.message}
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