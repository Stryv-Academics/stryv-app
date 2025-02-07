import { createClient } from "@/utils/supabase/server";

export const fetchMessages = async (
  conversation_id: string,
  offset: number,
  limit: number
) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth session missing or error fetching user:", userError);
  }

  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("title")
    .eq("id", conversation_id);

  if (conversationError) {
    console.error("Error fetching conversation info");
    return [];
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching messages:", error.message);
    return [];
  }

  const messagesWithStyle = messages.reverse().map((msg) => ({
    ...msg,
    current_user_is_sender: msg.sender_id === user?.id,
  }));

  const { data: readReceipts, error: receiptError } = await supabase
    .from("message_reads")
    .select("message_id")
    .eq("user_id", user?.id);
  if (receiptError) {
    console.error("Error fetching read receipts:", receiptError);
    return [];
  }
  const readMessageIds = new Set(
    readReceipts.map((receipt) => receipt.message_id)
  );
  const messagesWithReadStatus = messagesWithStyle.map((message) => ({
    ...message,
    read: readMessageIds.has(message.id),
  }));
  //note that the existence of a title is being used to determine if a conversation is a private or group chat
  //hence private conversations should not have titles, and group chats must have titles.
  if (conversation[0].title === null) {
    return messagesWithReadStatus;
  } else {
    const messagesWithFirstNames = await Promise.all(
      messagesWithReadStatus.map(async (msg: typeof messagesWithReadStatus[number]) => {
        const { data: profiles, error } = await supabase
          .from("accounts")
          .select("first_name")
          .eq("id", msg.sender_id);

        if (error) {
          console.error(
            `Error fetching first_name for sender_id ${msg.sender_id}:`,
            error.message
          );
          return { ...msg, first_name: null };
        }

        const firstName = profiles?.[0]?.first_name || "Unknown";
        return { ...msg, first_name: firstName };
      })
    );

    return messagesWithFirstNames;
  }
};
