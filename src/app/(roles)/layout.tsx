import { getUser } from "@/app/auth/server/userHandlers";
import Sidebar from "@/components/custom/Sidebar";
import { fetchTableDataSingle } from "@/services/supabase/dataService";
import { Account } from "@/types";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userID: string; // Declare userID outside for accessibility

  try {
    const user = await getUser();

    // Throw an error if no user is found
    if (!user) {
      throw new Error(
        "[DashboardLayout] User not found. Authentication required."
      );
    }

    // Assign user ID if user exists
    userID = user.id;
    console.log("[DashboardLayout] User ID:", userID);
  } catch (error) {
    console.error("[DashboardLayout] Failed to fetch user:", error);
    throw error; // Rethrow the error to prevent further execution
  }

  // Fetch user data only if the user is valid
  const userData = await fetchTableDataSingle<Account>(
    "accounts",
    ["role", "first_name", "last_name"],
    "id",
    userID
  );

  console.log("[DashboardLayout] User Data:", userData);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-white to-gray-50 flex">
      {/* Left Sidebar */}
      <Sidebar userData={userData} />

      {/* Right Content Area */}
      <div className="flex-grow bg-white overflow-scroll p-6">{children}</div>
    </div>
  );
}
