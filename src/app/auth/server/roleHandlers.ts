import { Roles, type Account, type Role, type User } from "@/types";
import { fetchTableDataSingle } from "@/services/supabase/dataService";
import { getUser } from "./userHandlers";

export function isRole(role: unknown): role is Role {
  return (
    typeof role === "string" && Object.values(Roles).includes(role as Role)
  );
}

export const getUserRole = async (): Promise<Role | null> => {
  try {
    // Step 1: Fetch user ID
    const user: User | null = await getUser();

    // Step 2: Handle null/no user
    if (!user) {
      console.warn("[getUserRole] No user retrieved. Returning null object.");
      return null;
    }

    // Step 3: Fetch role from database
    const { role } =
      (await fetchTableDataSingle<Account>(
        "accounts",
        ["role"],
        "id",
        user.id
      )) ?? {}; // Fallback to empty object if null/undefined

    // Step 4: Validate the role
    if (isRole(role)) {
      console.log("[getUserRole] Valid role retrieved:", role);
      return role; // Directly return the validated role
    }

    // Step 5: Handle invalid role
    console.warn("[getUserRole] No valid role found. Returning null object.");
    return null; // Return null instead of throwing
  } catch (err) {
    // Step 6: Log unexpected errors and propagate
    console.error("[getUserRole] Unexpected error:", err);
    return null; // Gracefully handle errors
  }
};
