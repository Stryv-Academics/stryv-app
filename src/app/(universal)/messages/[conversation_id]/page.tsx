import React from "react";
import { fetchMessages } from "@/services/getMessages";
import getConversationName from "@/services/getConversationName";
import Chat from "@/components/custom/Chat";
import { redirect } from "next/navigation";

const ConversationPage = async ({
  params,
}: {
  params: { conversation_id: string };
}) => {
  const { conversation_id } = await params;

  // Fetch messages
  const messages = await fetchMessages(conversation_id, 0, 25);
  if (messages.length === 0) {
    redirect("/error");
    //row level security in supabase already prevents access of messages, but this prevents accessing an empty page
    //with the chatbox to send messages
  }

  const conversation_name = await getConversationName(conversation_id);

  return (
    <div>
      <Chat
        initialMessages={messages}
        conversation_id={conversation_id}
        conversation_name={conversation_name}
      />
    </div>
  );
};

export default ConversationPage;
