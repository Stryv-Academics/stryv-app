import Image from "next/image";

interface UserData {
  first_name?: string;
  last_name?: string;
  role?: string;
}

export default function Welcome({ userData } : { userData : UserData | null }) {
  return (
    <div className="p-4 flex-1">
      <div className="rounded-2xl border border-gray-300 bg-white p-6">
        <div className="flex items-center gap-4">
          <Image
            src="/avatar.png"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome, {userData?.first_name || "User"}!
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};