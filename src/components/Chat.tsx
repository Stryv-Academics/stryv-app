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
    attachment_name: string | null;
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
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                console.error("Error fetching user:", error?.message || "No user found");
                return;
            }
            console.log("gotten userId");
            setUserId(user.id); // Set user ID to state
        };
        fetchUser();
    }, []);

    // Pusher setup for real-time updates
    useEffect(() => {
        if (!userId) return;

        console.time("Pusher execution time");
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
        });

        const channel = pusher.subscribe("stryv-test-development");
        channel.bind("new-message", (data: any) => {
            setMessages((prevMessages) => {
                if (data.sender_id === userId) {
                    console.log("meow");
                    return prevMessages;
                }
                return [
                ...(prevMessages || []),
                { id: null, conversation_id: conversation_id, content: data.content, message_type: null, attachment_url: null, 
                    attachment_name: null, created_at: data.created_at, sender_id: data.sender_id, first_name: data.first_name },
            ]});
        });
        console.timeEnd("Pusher execution time");

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [userId]);

    const uploadFile = async (file: File) => {
        const file_path = `${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("attachments")
            .upload(file_path, file);

        if (error) {
            console.error('Error uploading file:', error.message);
            console.error('Detailed error:', error);
            return { url: "", type: "" };
        }

        const { data: publicUrl } = supabase.storage.from("attachments").getPublicUrl(file_path);
        console.log(publicUrl.publicUrl);
        return {
            url: publicUrl.publicUrl || "",
            type: file.type,
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("Error fetching user:", userError?.message || "No user found");
            return;
        }

        const { data: profile, error: profileError } = await supabase
                .from("accounts")
                .select("first_name")
                .eq("id", user.id);
        if (profileError || !profile) {
            console.error("Error fetching profile:", profileError || "No profile found");
            return;
        }

        let attachment_url: any = "";
        let message_type = "text";
        let attachment_name: any = "";
    
        if (file) {
            console.log("File selected:", file.name);
            const { url, type } = await uploadFile(file);

            if (type.startsWith("image/")) {
                message_type = "image";
            } else if (type.startsWith("video/")) {
                message_type = "video";
            } else if (type === "application/pdf") {
                message_type = "pdf";
            } else if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                message_type = "docx";
            }

            if (!url) {
                console.log("File upload failed");
                return;
            }            
            attachment_url = url;
            attachment_name = file.name;
        }

        console.log(attachment_name);

        const tempMessage: MessageProp = {
            id: null,
            conversation_id: conversation_id,
            content: newMessage,
            message_type: message_type,
            attachment_url: file ? URL.createObjectURL(file) : null, // Show local preview for file
            attachment_name: attachment_name,
            created_at: new Date().toISOString(),
            sender_id: user.id,
            first_name: profile[0].first_name,
        };

        setMessages((prevMessages) => [...prevMessages, tempMessage]); // Optimistic update
        setNewMessage(""); // clear input field
        setFile(null);

        try {
            const { data, error } = await supabase
                .from("messages")
                .insert([{ content: newMessage, conversation_id: conversation_id, sender_id: user.id, attachment_url: attachment_url, message_type: message_type, }]);

            if (error) {
                console.error("Error sending message:", error.message);
                return;
            }

            const eventData = {
                sender_id: user.id,
                content: newMessage,
                first_name: profile[0].first_name,
                created_at: formatDateTime(new Date().toISOString()),
                attachment_url: attachment_url,
                message_type: message_type,
            };

            await triggerPusherEvent("stryv-test-development", "new-message", eventData);

        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    console.log(messages);

    return (
        <div>
            <div className="flex flex-col gap-4 mb-4">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg?.first_name || "Anonymous"}:</strong> {msg?.content || ""}
                        {msg.message_type === "image" && msg.attachment_url && (
                            <div className="mt-2">
                                <img
                                    src={msg.attachment_url}
                                    alt={msg.attachment_url.split("-").pop()}
                                    className="max-w-full h-auto border rounded"
                                />
                            </div>
                        )}
                        {msg.message_type === "pdf" && msg.attachment_url && (
                            <div>
                                <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    {msg.attachment_name} {msg.attachment_url.split("-").pop()}
                                </a>
                            </div>
                        )}
                        {msg.message_type === "docx" && msg.attachment_url && (
                            <div>
                                <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    {msg.attachment_name} {msg.attachment_url.split("-").pop()}
                                </a>
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
                    onChange={(e) => {
                        const selectedFile = e.target.files ? e.target.files[0] : null;
                        setFile(selectedFile);
                        if (selectedFile) {
                            console.log(selectedFile.name);
                        }}}
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