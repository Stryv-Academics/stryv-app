import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  console.log("[api/auth/callback] Retrieved parameter 'code':", code);
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";
  console.log("[/auth/server/callback] Retrieved parameter 'redirect':", next);

  if (code) {
    console.log("[api/auth/callback] Creating supabase client...");
    const supabase = await createClient();
    console.log("[api/auth/callback] Exchanging code for session...");
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        console.log(
          `[api/auth/callback] (isLocalEnv): Login successful! Redirecting to: ${origin}${next}`
        );
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        console.log(
          `[api/auth/callback] (!isLocalEnv && forwardedHost): Login successful! Redirecting to: ${forwardedHost}${next}`
        );
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        console.log(
          `[api/auth/callback] (!isLocalEnv && !forwardedHost): Login successful! Redirecting to: ${origin}${next}`
        );
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
