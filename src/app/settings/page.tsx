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

  return <AccountForm user={user} userData={userData} />;
}
