interface User {
    id: number;
    title: string;
    role: string;
    hours: number;
}

interface UserNameCardProps {
    user: User;
}

const UserNameCard = ({ user }: UserNameCardProps) => {
    return (
        <div className="user-name-card">
            <p>{user.title}</p>
        </div>
    );
}

export default UserNameCard;
