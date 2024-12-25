const Messages = ({ messages }: { messages: any[] }) => {
    return (
        <div>
            <ul>
                {messages.map((msg) => (
                    <li key={msg.id}>
                        <strong>{msg.first_name}</strong>: {msg.content}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Messages;
