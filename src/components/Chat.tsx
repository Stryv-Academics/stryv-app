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
    const [file, setFile] = useState<File | null>(null);

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

    const uploadFile = async (file: File) => {
        const file_path = `${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("attachments")
            .upload(file_path, file);

        if (error) {
            console.error('Error uploading file:', error.message);
            console.error('Detailed error:', error);
            return "";
        }

        const { data: publicUrl } = supabase.storage.from("attachments").getPublicUrl(file_path);
        console.log(publicUrl.publicUrl);
        return publicUrl.publicUrl || "";
    }

    /* const saveAttachmentMessage = async (message: string, attachment_url: string, conversation_id: string, user_id: string) => {
        const { data, error } = await supabase
            .from("messages")
            .insert([{ content: message, attachment_url: attachment_url, conversation_id: conversation_id, sender_id: user_id }]);
        if (error) {
            console.error('Error saving message:', error.message);
            return null;
        }
    
        return data;
    } */

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

        /* const fileInput = document.getElementById("file") as HTMLInputElement;
        const file = fileInput?.files ? fileInput.files[0] : null; */
        let attachment_url: any = "";
    
        if (file) {
            console.log("File selected:", file.name);
            attachment_url = await uploadFile(file);
            //await saveAttachmentMessage(newMessage, attachment_url, conversation_id, user.id)
            if (!attachment_url) {
                console.log("File upload failed");
                return;
            }
        }

        try {
            const { data, error } = await supabase
                .from("messages")
                .insert([{ content: newMessage, conversation_id: conversation_id, sender_id: user.id, attachment_url: attachment_url }]);

            if (error) {
                console.error("Error sending message:", error.message);
                return;
            }

            const eventData = {
                sender_id: user.id,
                content: newMessage,
                first_name: profile?.[0]?.first_name,
                created_at: formatDateTime(new Date().toISOString()),
                attachment_url: attachment_url,
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
                        {msg.attachment_url && (
                            <div className="mt-2">
                                <img
                                    src={msg.attachment_url}
                                    alt="Attachment"
                                    className="max-w-full h-auto border rounded"
                                />
                            </div>
                        )}
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
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="border p-2 rounded"
                />
                <button type="submit" className={`px-4 py-2 rounded transition-all duration-200 ${
                        newMessage.trim() === ""
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`} disabled={newMessage.trim() === ""}>
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chat;