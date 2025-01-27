"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { triggerPusherEvent } from "@/services/triggerPusherEvent";
import uploadFile from "@/services/uploadFile";
import Link from "next/link";
import Pusher from "pusher-js";
import { Send, ArrowLeft, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  created_at: string;
  sender_id: string | null;
  first_name: string | null;
  current_user_is_sender: boolean;
  read: boolean;
}

interface ChatProps {
  initialMessages: MessageProp[];
  conversation_id: string;
  conversation_name: string;
}

interface GroupedMessages {
  [date: string]: MessageProp[];
};

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

const Chat = ({ initialMessages, conversation_id, conversation_name }: ChatProps) => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const closeModal = () => setSelectedImage(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        console.error(
          "Error fetching user:",
          error?.message || "No user found"
        );
        return;
      }
      setUserId(user.id); // Set user ID to state
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

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
          {
            id: null,
            conversation_id: conversation_id,
            content: data.content,
            message_type: null,
            attachment_url: null,
            attachment_name: null,
            created_at: data.created_at,
            sender_id: data.sender_id,
            first_name: data.first_name || null,
            current_user_is_sender: true,
            read: false,
          },
        ];
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const fileExtension = file?.name.split('.').pop()?.toLowerCase();

    const tempMessage: MessageProp = {
      id: null,
      conversation_id: conversation_id,
      content: newMessage,
      message_type: fileExtension ? fileExtension : null,
      attachment_url: file ? URL.createObjectURL(file) : null, // Show local preview for file
      attachment_name: file? file.name : null,
      created_at: new Date().toISOString(),
      sender_id: userId,
      first_name: null, // not necessary for user's own message
      current_user_is_sender: true,
      read: false,
    };

    setMessages((prevMessages) => [...prevMessages, tempMessage]); // Optimistic update
    setNewMessage(""); // clear input field
    setFile(null);
    setImagePreview(null);

    const { data: profile, error: profileError } = await supabase
      .from("accounts")
      .select("first_name")
      .eq("id", userId);
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
      } else if (type ==="application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        message_type = "docx";
      }

      if (!url) {
        console.log("File upload failed");
        return;
      }
      attachment_url = url;
      attachment_name = file.name;
    }

    try {
      const { data: insertData, error: insertError } = await supabase
        .from("messages")
        .insert([
          {
            content: newMessage,
            conversation_id: conversation_id,
            sender_id: userId,
            attachment_url: attachment_url,
            message_type: message_type,
          },
        ]);
      if (insertError) {
        console.error("Error sending message:", insertError.message);
        return;
      }

      const { data: updateData, error: updateError } = await supabase
          .from("conversations")
          .update({"updated_at": new Date().toISOString()})
          .eq("id", conversation_id);
      if (updateError) {
        console.error("Error in updating time new message is sent:", updateError.message);
      }

      const eventData = {
        sender_id: userId,
        content: newMessage,
        first_name: profile[0].first_name || null,
        created_at: formatDateTime(new Date().toISOString()),
        attachment_url: attachment_url,
        message_type: message_type,
      };

      await triggerPusherEvent(
        "stryv-test-development",
        "new-message",
        eventData
      );
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const groupMessagesByDate = (msgs: MessageProp[]): GroupedMessages => {
    return msgs.reduce((acc: GroupedMessages, msg: MessageProp) => {
      const currentYear = new Date().getFullYear();
      const date = new Date(msg.created_at);
      const today = new Date();
      date.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      let dateFormatted;

      if (date.getTime() === today.getTime()) {
        dateFormatted = "Today";
      } else if (date.getFullYear() === currentYear) {
        dateFormatted = date.toLocaleDateString(undefined, {
          month: "long",
          day: "numeric"
        });
      } else {
        dateFormatted = date.toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric"
        });
      }
      if (!acc[dateFormatted]) {
        acc[dateFormatted] = [];
      }
      acc[dateFormatted].push(msg);
      return acc;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  function formatTime(dateString: any) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  useEffect(() => {
    if (messagesEndRef) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [groupedMessages]);

  const markMessageAsRead = async (message_id: string | null) => {
    const { error } = await supabase
        .from("message_reads")
        .upsert([
            {
                message_id,
                user_id: userId,
                read_at: new Date().toISOString(),
            },
        ], {
          onConflict: "user_id,message_id",
          ignoreDuplicates: true
        });

    if (error) {
        console.error("Error marking message as read:", error);
    } else {
        // Update the local state to reflect the read status
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === message_id ? { ...msg, read: true } : msg
            )
        );
    }
  };
  //console.log(userId);
  useEffect(() => {
    if (!userId) {
      return;
    }
    const markMessagesAsRead = async () => {
        const unreadMessages = messages.filter((message) => !message.read && message.sender_id !== userId);
        for (const message of unreadMessages) {
            await markMessageAsRead(message.id);
        }
    };
    markMessagesAsRead();
  }, [messages, userId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        alert(`File size exceeds the limit of 1MB. Please select a smaller file.`);
        e.target.value = "";
        return;
      }
  
      setFile(selectedFile);
  
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === "string") {
            setImagePreview(event.target.result);
          }
        };
        reader.readAsDataURL(selectedFile);
      }
    }
    textareaRef.current?.focus();
  };

  const handleTextChange = (e: any) => {
    setNewMessage(e.target.value);
    e.target.style.height = '1.5rem';
    if (e.target.scrollHeight > e.target.clientHeight) {
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const removeFilePreview = () => {
    setImagePreview(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  console.log(messages);
  if (!messages[0].first_name) {
    return (
      <div className="h-full flex flex-col max-h-screen overflow-hidden bg-white">
        <div className="flex-none sticky top-0 z-10 bg-white p-6 shadow">
          <div className="flex items-center gap-4">
            <Link href={`/messages`}>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h2 className="text-xl font-semibold text-gray-900">
              {conversation_name}
            </h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="text-center text-gray-500 text-sm font-medium mb-4">{date}</div>
              {msgs.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.current_user_is_sender ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.current_user_is_sender ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"}`}
                    style={{
                      marginTop: index > 0 && msgs[index - 1].current_user_is_sender ? '0.15rem' : '0.5rem',
                    }}
                  >
                    {msg.message_type === "image" && msg.attachment_url && (
                      <div className="mt-2 relative group cursor-pointer">
                        <img
                          src={msg.attachment_url}
                          alt={msg.attachment_url.split("-").pop()}
                          className="max-w-full max-h-[30vh] p--3 object-contain border rounded cursor-pointed"
                          onClick={() => setSelectedImage(msg.attachment_url)}
                        />
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity rounded pointer-events-none"></div>
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
                    {(msg.message_type === "pdf" || msg.message_type === "docx") && msg.attachment_url && (
                      <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg text-gray-900 underline"
                      >
                        <div className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded">
                          <File className="w-4 h-4" />
                        </div>
                        <span>
                          {msg.attachment_name || msg.attachment_url.split("-").pop()}
                        </span>
                      </a>
                    )}
                    <p className={`text-m ${msg.message_type !== "text" && msg.attachment_url ? "pt-2" : ""}`}>{msg.content}</p>
                    <span className="text-xs block opacity-70 text-right">
                      <i className="block text-sm select-none">
                        {msg?.created_at ? formatTime(msg.created_at) : ""}
                      </i>
                    </span>
                  </div>
                </div>
                ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex-none sticky bottom-0 z-10 bg-gray-50 border-t p-6 shadow">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full" style={{ height: "auto" }}>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.heic,.mp4,.mov,.pdf,.docx"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`px-4 py-2 rounded ${"bg-blue-500 text-white hover:bg-blue-600"}`}
            >
              <File className="w-4 h-4" />
            </Button>
            <div className="flex-grow p-2 border rounded resize-none overflow-hidden min-h-[2.5rem] max-h-[10rem] relative">
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Image preview"
                    className="max-w-[200px] h-auto mt-2 mb-2 object-contain border rounded cursor-pointer"
                  />
                  <X className="w-8 h-8 text-gray-500 cursor-pointer absolute top-1/2 right-0 transform -translate-y-1/2" onClick={removeFilePreview} />
                </div>
              )}
              {file && (file.type === "application/pdf" || file.name.endsWith(".pdf") || file.name.endsWith(".docx")) && (
                <div className="relative mt-2 mb-2 p-2 border rounded bg-white flex items-center">
                  <File className="w-4 h-4 mr-2" />
                  <span className="text-gray-700">{file.name}</span>
                  <X className="w-8 h-8 text-gray-500 cursor-pointer absolute top-1/2 right-0 transform -translate-y-1/2" onClick={removeFilePreview} />
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={handleTextChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    document.getElementById("sendMessageBtn")?.click();
                  }
                }}
                className="w-full h-auto resize-none border-none outline-none bg-transparent"
                placeholder="Type your message..."
                style={{
                  height: "1.5rem",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                  lineHeight: "1.5rem",
                  overflow: "hidden",
                }}
              />
            </div>
            <Button
              id="sendMessageBtn"
              type="submit"
              className={`px-4 py-2 rounded transition-all duration-200 ${
                newMessage.trim() === "" && !file
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={newMessage.trim() === "" && !file}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeModal}>
            <img src={selectedImage} alt="Expanded image" className="max-w-[80vw] max-h-[80vh] object-contain rounded" />
            <X className="w-8 h-8 text-gray-200 cursor-pointer absolute top-7 right-7" onClick={closeModal} />
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="h-full flex flex-col max-h-screen overflow-hidden bg-white">
        <div className="flex-none sticky top-0 z-10 bg-white p-6 shadow">
          <div className="flex items-center gap-4">
            <Link href={`/messages`}>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h2 className="text-xl font-semibold text-gray-900">
              {conversation_name}
            </h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="text-center text-gray-500 text-sm font-medium mb-4">{date}</div>
            {msgs.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.current_user_is_sender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${msg.current_user_is_sender ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"}`}
                  style={{
                    marginTop: index > 0 && msgs[index - 1].current_user_is_sender ? '0.15rem' : '0.5rem',
                  }}
                >
                  {msg.sender_id !== userId && (
                    <strong>{msg?.first_name || "Anonymous"}</strong>
                  )}
                  {msg.message_type === "image" && msg.attachment_url && (
                    <div className="mt-2 relative group cursor-pointer">
                      <img
                        src={msg.attachment_url}
                        alt={msg.attachment_url.split("-").pop()}
                        className="max-w-full max-h-[30vh] p--3 object-contain border rounded cursor-pointed"
                        onClick={() => setSelectedImage(msg.attachment_url)}
                      />
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity rounded pointer-events-none"></div>
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
                  {(msg.message_type === "pdf" || msg.message_type === "docx") && msg.attachment_url && (
                    <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg text-gray-900 underline"
                    >
                      <div className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded">
                        <File className="w-4 h-4" />
                      </div>
                      <span>
                        {msg.attachment_name || msg.attachment_url.split("-").pop()}
                      </span>
                    </a>
                  )}
                  <p className={`text-m ${msg.message_type !== "text" && msg.attachment_url ? "pt-2" : ""}`}>{msg.content}</p>
                  <span className="text-xs block opacity-70 text-right">
                    <i className="block text-sm select-none">
                      {msg?.created_at ? formatTime(msg.created_at) : ""}
                    </i>
                  </span>
                </div>
              </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex-none sticky bottom-0 z-10 bg-gray-50 border-t p-6 shadow">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full" style={{ height: "auto" }}>
          <Input
            type="file"
            accept=".jpg,.jpeg,.png,.heic,.mp4,.mov,.pdf,.docx"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`px-4 py-2 rounded ${"bg-blue-500 text-white hover:bg-blue-600"}`}
            >
              <File className="w-4 h-4" />
            </Button>
            <div className="flex-grow p-2 border rounded resize-none overflow-hidden min-h-[2.5rem] max-h-[10rem] relative">
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Image preview"
                    className="max-w-[200px] h-auto mt-2 mb-2 object-contain border rounded cursor-pointer"
                  />
                  <X className="w-8 h-8 text-gray-500 cursor-pointer absolute top-1/2 right-0 transform -translate-y-1/2" onClick={removeFilePreview} />
                </div>
              )}
              {file && (file.type === "application/pdf" || file.name.endsWith(".pdf") || file.name.endsWith(".docx")) && (
                <div className="relative mt-2 mb-2 p-2 border rounded bg-white flex items-center">
                  <File className="w-4 h-4 mr-2" />
                  <span className="text-gray-700">{file.name}</span>
                  <X className="w-8 h-8 text-gray-500 cursor-pointer absolute top-1/2 right-0 transform -translate-y-1/2" onClick={removeFilePreview} />
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={handleTextChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    document.getElementById("sendMessageBtn")?.click();
                  }
                }}
                className="w-full h-auto resize-none border-none outline-none bg-transparent block"
                placeholder="Type your message..."
                style={{
                  height: "1.5rem",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                  lineHeight: "1.5rem",
                  overflow: "hidden",
                }}
              />
            </div>
            <Button
              id="sendMessageBtn"
              type="submit"
              className={`px-4 py-2 rounded transition-all duration-200 ${
                newMessage.trim() === "" && !file
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={newMessage.trim() === "" && !file}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeModal}>
            <img src={selectedImage} alt="Expanded image" className="max-w-[80vw] max-h-[80vh] object-contain rounded" />
            <X className="w-8 h-8 text-gray-200 cursor-pointer absolute top-7 right-7" onClick={closeModal} />
          </div>
        )}
      </div>
    );
  }
};

export default Chat;