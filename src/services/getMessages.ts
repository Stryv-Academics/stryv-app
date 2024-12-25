import { createClient } from "@/utils/supabase/server";

export const fetchMessagesWithFirstNames = async (conversation_id: string) => {
    const supabase = await createClient();

    const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching messages:", error.message);
        return [];
    }

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
};
