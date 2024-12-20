import { createClient } from "@/utils/supabase/server";
import Chat from "@/components/Chat";

const ChatPage = async () => {

  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
      console.error("Auth session missing or error fetching user:", userError);
      return <div>Error</div>;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError.message);
    return <div>Error loading profile</div>;
  }

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    //.eq("sender_id", user.id)
    .order("created_at", { ascending: true });

  if (messagesError) {
      console.error("Error fetching messages:", messagesError.message);
      return <div>Error loading messages</div>;
  }

  const formattedMessages = messages.map((message) => ({
      User: { name: message.sender_id },
      message: message.content,
  }));

  return (
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <Chat initialMessages={formattedMessages} user={user} />
      </div>
  );
};

export default ChatPage;