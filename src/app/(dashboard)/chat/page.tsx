import { createClient } from '@supabase/supabase-js';
import Chat from "@/components/Chat";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const ChatPage = async () => {
  // Fetch messages from Supabase
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.error("Error fetching chat data:", error?.message);
    return <div>Error loading messages</div>;
  }

  // Format messages
  const formattedMessages = data.map((message) => ({
    User: { name: message.sender_id }, // Adjust based on your schema
    message: message.content,
  }));

  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-6">
      <Chat initialMessages={formattedMessages} />
    </div>
  );
};

export default ChatPage;
