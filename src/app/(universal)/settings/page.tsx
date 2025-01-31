import { getUserStrict } from "@/app/auth/server/userHandlers";
import { fetchTableDataSingle } from "@/services/supabase/dataService";
import { Account, User } from "@/types";
import AccountForm from "./AccountForm";

export default async function ProfilePage() {
  // Fetch user and user id
  const user: User = await getUserStrict();
  const userID: string = user.id;
  console.log("[ProfilePage] User ID:", userID);

  // Fetch user data for UI
  const userData = await fetchTableDataSingle<Account>(
    "accounts",
    ["first_name", "last_name", "username"],
    "id",
    userID
  );

  return (
    <div className="min-h-[100dvh] bg-linear-to-b from-white to-gray-50 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">
          Profile Settings
        </h1>
        <AccountForm user={user} userData={userData} />
      </div>
    </div>
  );
}
