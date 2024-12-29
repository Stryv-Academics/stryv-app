import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const ChatPage = async () => {

  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
      console.error("Auth session missing or error fetching user:", userError);
      return <div>Error</div>;
  }
  console.log(user.id);

  const { data: conversations, error: conversationsError } = await supabase
    .from("conversation_participants")
    .select("*")
    //.eq("user_id", user.id) //this line is not necessary if supabase RLS policy is used
  console.log(conversations);

  if (conversationsError) {
    console.error("Error fetching conversation history:", conversationsError.message);
    return <div>Error loading conversations</div>;
  } else if (conversations.length == 0) {
    return <div>No conversation history.</div>
  }

  const uniqueConversations = Array.from(
    new Map(conversations.map((conv) => [conv.conversation_id, conv])).values()
  );

  const fetchConversationNames = async () => {
    const names = await Promise.all(
      uniqueConversations.map(async (conversation) => {
        const { data, error } = await supabase
          .from("conversations")
          .select("title")
          .eq("id", conversation.conversation_id);

        if (!data || data.length === 0 || data[0].title === null) {
          console.warn(`No title found for ${conversation.conversation_id}`);
          const { data: accountData, error: accountError} = await supabase
            .from("accounts")
            .select("first_name")
            .eq("id", conversation.user_id);
          
          if (accountError) {
            console.error(`Error fetching name for user_id ${conversation.user_id}`);
            return null;
          }
          if (!accountData || accountData.length === 0) {
            console.warn(`No name found for user_id ${conversation.user_id}`);
            return null;
          }
          return accountData[0].first_name; //there is only one element in the array for each conversation
        }
        return data[0].title;
      })
      /* conversations.map(async (conversation) => {
        const { data, error} = await supabase
          .from("accounts")
          .select("first_name")
          .eq("id", conversation.user_id);
        console.log(conversation.user_id);
        if (error) {
          console.error(`Error fetching name for user_id ${conversation.user_id}`);
          return null;
        }
        if (!data || data.length === 0) {
          console.warn(`No name found for user_id ${conversation.user_id}`);
          return null;
        }
        return data[0].first_name; //there is only one element in the array for each conversation
      }) */
    );
    return names;
  }
  
  const allConversationNames = await fetchConversationNames();
  console.log(allConversationNames);

  return (
    <div>
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
              {allConversationNames.map((name, index) => (
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  <Link href={`/messages/${uniqueConversations[index].conversation_id}`}>
                    <div key={index}>
                          {name}
                    </div>
                  </Link>
                </button>
              ))}
          </div>
    </div>
  );
};

export default ChatPage;