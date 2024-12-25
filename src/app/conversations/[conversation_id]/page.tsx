import { fetchMessagesWithFirstNames } from "@/services/getMessages";
import Chat from "@/components/Chat";

const ConversationPage = async ({ params }: { params: { conversation_id: string } }) => {
    const convo = params.conversation_id;

    const messages = await fetchMessagesWithFirstNames(convo);

    return (
        <div>
            
            <Chat initialMessages={messages} conversation_id={ convo } />
        </div>
    );
};

export default ConversationPage;
