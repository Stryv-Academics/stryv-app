import { fetchMessagesWithFirstNames } from "@/services/getMessages";
import Chat from "@/components/Chat";

const ConversationPage = async ({ params }: { params: { conversation_id: string } }) => {
    const { conversation_id } = await params;
    console.log(conversation_id);
    // Fetch messages
    const messages = await fetchMessagesWithFirstNames(conversation_id);

    return (
        <div>
            <Chat initialMessages={messages} conversation_id={conversation_id} />
        </div>
    );
};

export default ConversationPage;