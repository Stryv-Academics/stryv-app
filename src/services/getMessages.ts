import { createClient } from "@/utils/supabase/server";

export const fetchMessages = async (conversation_id: string) => {
    const supabase = await createClient();

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
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching messages:", error.message);
        return [];
    }
    //note that the existence of a title is being used to determine if a conversation is a private or group chat
    //hence private conversations should not have titles, and group chats must have titles.
    if (conversation[0].title === null) {
        console.log("This is a private conversation");
        return messages;
    } else {
        const messagesWithFirstNames = await Promise.all(
            messages.map(async (msg: any) => {
                const { data: profiles, error } = await supabase
                    .from("accounts")
                    .select("first_name")
                    .eq("id", msg.sender_id);
    
                if (error) {
                    console.error(`Error fetching first_name for sender_id ${msg.sender_id}:`, error.message);
                    return { ...msg, first_name: null };
                }
    
                const firstName = profiles?.[0]?.first_name || "Unknown";
                return { ...msg, first_name: firstName };
            })
        );
    
        return messagesWithFirstNames;
    }
};