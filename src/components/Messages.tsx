import { createClient } from "@/utils/supabase/server";

const Messages = async ({ conversation_id }: { conversation_id: string }) => {

    const supabase = await createClient();

    // Fetch messages for the specific conversation_id
    const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching messages:", error.message);
        return <div>Error loading messages for conversation {conversation_id}</div>;
    }

    const messagesWithFirstNames = await Promise.all(
        messages.map(async (msg: any) => {
          const { data: profiles, error } = await supabase
            .from("profiles")
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
      
      console.log(messagesWithFirstNames);
      

    return (
        <div>
            <h1>Conversation ID: {conversation_id}</h1>
            <ul>
                {messagesWithFirstNames.map((msg: any) => (
                    <li key={msg.id}>
                        <strong>{msg.first_name}</strong>: {msg.content}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Messages;