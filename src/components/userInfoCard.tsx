interface User {
    id: number;
    title: string;
    role: string;
    hours: number;
}

interface UserInfoCardProps {
    user: User;
}

const UserInfoCard = ({ user }: UserInfoCardProps) => {
    return (
        <div className="user-name-card">
            <p>{user.role}</p>
            <p>{user.hours}</p>
        </div>
    );
}

export default UserInfoCard;