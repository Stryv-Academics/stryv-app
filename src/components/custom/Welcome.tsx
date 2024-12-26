import { Account } from "@/types";
import { Card } from "../ui/card";

export default function Welcome({ userData }: { userData: Account }) {
  return (
    <Card className="p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src="/avatar.png"
          alt="Profile"
          className="rounded-full w-10 h-10"
        />
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome, {userData.first_name || "User"}!
          </h1>
        </div>
      </div>
    </Card>
  );
}
