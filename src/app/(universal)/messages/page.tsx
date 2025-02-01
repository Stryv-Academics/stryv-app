import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import fetchUnreadCounts from "@/services/getUnreadMessages";

import { MessageSquare, ArrowLeft, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const MessagesPage = async () => {
  const supabase = await createClient();

  const { data: { user }, error: userError, } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth session missing or error fetching user:", userError);
    return <div>Error</div>;
  }
  console.log(user.id);

  function formatTime(dateString: any) {
    const date = new Date(dateString);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedDate = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    if (startOfYesterday < date && date < startOfToday) {
      return "Yesterday"
    } else if (date < startOfToday) {
      return formattedDate;
    } else {
      return `${hours}:${minutes}`;
    }
  }

  /* const { data: conversations, error: conversationsError } = await supabase
    .from("conversation_participants")
    .select("*");
  //.eq("user_id", user.id) //this line is not necessary if supabase RLS policy is used
  console.log(conversations);

  if (conversationsError) {
    console.error(
      "Error fetching conversation history:",
      conversationsError.message
    );
    return <div>Error loading conversations</div>;
  } else if (conversations.length == 0) {
    return <div>No conversation history.</div>;
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
          const { data: accountData, error: accountError } = await supabase
            .from("accounts")
            .select("first_name")
            .eq("id", conversation.user_id);

          if (accountError) {
            console.error(
              `Error fetching name for user_id ${conversation.user_id}`
            );
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
    );
    return names;
  };

  const allConversationNames = await fetchConversationNames();
  console.log(allConversationNames); */
  const convos = await fetchUnreadCounts();
  const conversations = convos.sort((a: any, b: any) => {
    const dateA = new Date(a.latest_message_created_at).getTime();
    const dateB = new Date(b.latest_message_created_at).getTime();
    return dateB - dateA;
  });

  return (
    <div className="max-w-full h-screen mx-auto p-6 bg-white flex flex-col">
      <Card className="shadow-xs rounded-lg flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="p-6 shrink-0">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center justify-start gap-2">
                <Link href={`/`}>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <MessageSquare className="w-10 h-10 text-blue-600 mt-1" />
                <h1 className="text-3xl font-semibold text-gray-900">
                  Messages
                </h1>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/0 flex flex-col gap-4 px-14">
            {conversations.map((conversation: any) => (
              <div key={conversation.conversation_id} className="flex items-center gap-4 w-full">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <img src={conversation.profilePicture || "/default-profile.png"}
                    alt={`${conversation.conversation_title}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Link href={`/messages/${conversation.conversation_id}`} className="flex-1 min-w-0 max-w-full">
                  <div
                    key={index}
                    className="p-4 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer bg-white shadow-xs border border-gray-200"
                  >
                    <div className="flex my-1 w-full relative">
                      <div className="flex-1 gap-2 min-w-0">
                        <span className="font-semibold text-gray-900">
                          {conversation.conversation_title}
                        </span>
                        {conversation.latest_message && (
                          <p className="text-sm text-gray-500 truncate">{conversation.latest_message}</p>
                        )}
                      </div>
                      <div className="shrink-0 flex flex-col gap-1 items-end">
                        {conversation.latest_message_created_at && (
                          <p className={`text-xs ${conversation.unread_count > 0 ? "text-blue-600 font-bold" : "text-gray-500"}`}>
                            {formatTime(conversation.latest_message_created_at)}
                          </p>
                        )}
                        {conversation.unread_count > 0 && (
                          <div className="relative flex items-center justify-center w-6 h-6">
                            <Circle fill="currentColor" className="text-blue-600 w-full h-full" />
                            <span className="absolute text-sm text-white font-medium flex items-center justify-center leading-tight">
                              {conversation.unread_count}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MessagesPage;
