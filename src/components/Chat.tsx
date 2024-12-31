"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { triggerPusherEvent } from "@/services/triggerPusherEvent";
import Link from "next/link";
import Pusher from "pusher-js";
import {
    MessageSquare,
    Search,
    Clock,
    Send,
    ArrowLeft,
    File
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const MAX_FILE_SIZE = 1 * 1024 * 1024;
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
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
                    return prevMessages;
                }
                return [
                ...(prevMessages || []),
                { id: null, conversation_id: conversation_id, content: data.content, message_type: null, attachment_url: null, 
                    attachment_name: null, created_at: data.created_at, sender_id: data.sender_id, first_name: data.first_name || null },
            ]});
        });
        console.timeEnd("Pusher execution time");

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [userId]);

    const uploadFile = async (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            return { url: "", type: "" };
        }
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
            } /* else if (type.startsWith("video/")) {
                message_type = "video";
            } */ else if (type === "application/pdf") {
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

        const tempMessage: MessageProp = {
            id: null,
            conversation_id: conversation_id,
            content: newMessage,
            message_type: message_type,
            attachment_url: file ? URL.createObjectURL(file) : null, // Show local preview for file
            attachment_name: attachment_name,
            created_at: new Date().toISOString(),
            sender_id: user.id,
            first_name: profile[0].first_name || null,
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
                first_name: profile[0].first_name || null,
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
    if (!messages[0].first_name) {
        console.log("No first name lah");
    }
    
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 p-6">
                <Link href={`/messages`}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                {/* <h2 className="text-xl font-semibold text-gray-900">
                    {selectedMessage.sender}
                </h2> */}
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${msg.sender_id === userId
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                                }`}
                        >
                            <p className="text-sm">{msg.content}</p>
                            <span className="text-xs mt-1 block opacity-70">
                                <i className="block text-sm">{msg?.created_at ? formatDateTime(msg.created_at) : ""}</i>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex gap-2 p-6 bg-white items-center">
                <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
                    <Input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow p-2 border rounded"
                    />
                    <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.heic,.mp4,.mov,.pdf,.docx"
                        onChange={(e) => {
                            const selectedFile = e.target.files ? e.target.files[0] : null;
                            if (selectedFile) {
                                if (selectedFile.size > MAX_FILE_SIZE) {
                                    alert(`File size exceeds the limit of 1MB. Please select a smaller file.`);
                                    e.target.value = "";
                                    return;
                                }
                                setFile(selectedFile);
                            }}}
                        ref={fileInputRef}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`px-4 py-2 rounded ${
                            "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                        <File className="w-4 h-4" />
                    </Button>
                    <Button type="submit" className={`px-4 py-2 rounded transition-all duration-200 ${
                            newMessage.trim() === ""
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                        }`} disabled={newMessage.trim() === ""}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    )

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
                        {/* {msg.message_type === "video" && msg.attachment_url && (
                            <div className="mt-2">
                                <video
                                    controls
                                    className="max-w-full h-auto border rounded"
                                >
                                    <source src={msg.attachment_url} type="video/mp4" />
                                    <source src={msg.attachment_url} type="video/quicktime" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )} */}
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
                    accept=".jpg,.jpeg,.png,.heic,.mp4,.mov,.pdf,.docx"
                    onChange={(e) => {
                        const selectedFile = e.target.files ? e.target.files[0] : null;
                        if (selectedFile) {
                            if (selectedFile.size > MAX_FILE_SIZE) {
                                alert(`File size exceeds the limit of 1MB. Please select a smaller file.`);
                                e.target.value = "";
                                return;
                            }
                            setFile(selectedFile);
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