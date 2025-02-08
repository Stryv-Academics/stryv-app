import { createClient } from "@/utils/supabase/server";

const getConversationName = async (conversation_id: string) => {
  const supabase = await createClient();

  const { data: conversationData, error: conversationError } = await supabase
    .from("conversations")
    .select("title")
    .eq("id", conversation_id);

  if (conversationError) {
    console.error("Error fetching conversation name:", conversationError);
  } else if (
    !conversationData ||
    conversationData?.[0]?.title === null ||
    conversationData?.[0]?.title === ""
  ) {
    const { data: privateConversationData, error: privateConversationError } =
      await supabase
        .from("conversation_participants")
        .select("user_id")
        .eq("conversation_id", conversation_id);
      if (privateConversationError) {
        console.log("Error in fetching private conversation: ", privateConversationError);
      }
    const { data: accountData, error: accountError } = 
      await supabase
        .from("accounts")
        .select("first_name")
        .eq("id", privateConversationData?.[0].user_id);
      if (accountError) {
        console.log("Error in fetching account data: ", accountError);
      }
    return accountData?.[0]?.first_name;
  } else {
    return conversationData?.[0]?.title || "Untitled Conversation";
  }
};

export default getConversationName;
