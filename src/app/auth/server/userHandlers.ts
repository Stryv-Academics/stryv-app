import { createClient } from "@/utils/supabase/server";
import { type User } from "@/types"; // Import User type

export const getUser = async (): Promise<User | null> => {
  try {
    const supabase = await createClient();

    // Fetch user data
    const { data, error } = await supabase.auth.getUser();

    // Handle Supabase error
    if (error) {
      console.error("[getUser] Failed to fetch user:", error.message); // Log error
      return null; // Return null for graceful handling
    }

    // Return the user or null if data.user is undefined
    return data?.user ?? null;
  } catch (err) {
    console.error("[getUser] Unexpected error:", err); // Log unexpected runtime errors
    return null;
  }
};

export const getUserStrict = async (): Promise<User> => {
  try {
    const supabase = await createClient();

    // Fetch user data
    const { data, error } = await supabase.auth.getUser();

    // Handle Supabase-specific errors
    if (error) {
      console.error(
        "[getUserStrict] Supabase error fetching user:",
        error.message
      );
      throw new Error("[getUserStrict] Failed to fetch user from Supabase.");
    }

    // Handle cases where user is null
    if (!data?.user) {
      throw new Error(
        "[getUserStrict] No authenticated user found. Please log in."
      );
    }

    // Return the valid user
    return data.user;
  } catch (err) {
    console.error("[getUserStrict] Unexpected error:", err);
    throw err; // Propagate the error for higher-level handling
  }
};
