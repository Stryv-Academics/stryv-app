"use client";

import Image from "next/image";

interface WelcomeProps {
  type: string;
  username?: string;
}

const Welcome: React.FC<WelcomeProps> = ({ username = "Zach" }) => {
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
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome, {username}!
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
