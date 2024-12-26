import { NextResponse } from "next/server";

/**
 * Resets cookies from a supabaseResponse to a new response object.
 * Ensures cookie synchronization to avoid session desynchronization issues.
 *
 * @param newResponse - The new response object (e.g., redirect or custom response).
 * @param supabaseResponse - The response containing Supabase cookies.
 * @returns The new response with cookies synchronized.
 */
export function resetSupabaseCookies(
  newResponse: NextResponse,
  supabaseResponse: NextResponse
): NextResponse {
  console.log("[resetSupabaseCookies] Starting cookie synchronization.");

  try {
    // Get cookies from Supabase response
    const supabaseCookies = supabaseResponse.cookies.getAll();
    console.log("[resetSupabaseCookies] Retrieved cookies:", supabaseCookies);

    // Copy each cookie individually
    supabaseCookies.forEach(({ name, value }) => {
      try {
        newResponse.cookies.set(name, value);
        console.log(`[resetSupabaseCookies] Set cookie: ${name}`);
      } catch (cookieError) {
        console.error(
          `[resetSupabaseCookies] Error setting cookie: ${name}`,
          cookieError
        );
      }
    });

    console.log("[resetSupabaseCookies] Successfully synchronized cookies.");
  } catch (error) {
    console.error(
      "[resetSupabaseCookies] Failed to synchronize cookies:",
      error
    );
  }

  return newResponse;
}
