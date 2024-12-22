import { useRouter } from 'next/router';

const ConversationPage = () => {
    const router = useRouter();
    const { conversation_id } = router.query;

    return (
        <div>
            <h1>Conversation ID: {conversation_id as string}</h1>
        </div>
    );
};

export default ConversationPage;