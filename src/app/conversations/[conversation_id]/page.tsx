import Messages from "@/components/Messages";

const ConversationPage = async ({ params }: { params: { conversation_id: string } }) => {
    const { conversation_id } = await params;

    return (
        <div>
            <Messages conversation_id={conversation_id} />
        </div>
    );
};

export default ConversationPage;
