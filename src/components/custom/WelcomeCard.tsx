import { Account } from "@/types";
import { Card } from "../ui/card";
import Image from "next/image";

export default function Welcome({ userData }: { userData: Account }) {
  return (
    <Card className="p-6 shadow-xs">
      <div className="flex items-center gap-4">
        <div className="relative w-10 h-10">
          <Image
            src="/avatar.png"
            alt="Avatar"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome, {userData.first_name || "User"}!
          </h1>
        </div>
      </div>
    </Card>
  );
}
