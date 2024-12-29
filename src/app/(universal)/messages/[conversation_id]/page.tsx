import { fetchMessagesWithFirstNames } from "@/services/getMessages";
import Chat from "@/components/Chat";
import { redirect } from "next/navigation";

const ConversationPage = async ({ params }: { params: { conversation_id: string } }) => {
    const { conversation_id } = await params;
    console.log(conversation_id);
    // Fetch messages
    const messages = await fetchMessagesWithFirstNames(conversation_id);
    if (messages.length === 0) {
        redirect("/error");
        //row level security in supabase already prevents access of messages, but this prevents accessing an empty page
        //with the chat box to send messages
    }

    return (
        <div>
            <Chat initialMessages={messages} conversation_id={conversation_id} />
        </div>
    );
};

export default ConversationPage;