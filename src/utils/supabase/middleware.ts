import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getUserRole } from "@/app/auth/server/roleHandlers";

export async function updateSession(request: NextRequest) {
  console.log("[updateSession] Incoming request:", {
    url: request.url,
    method: request.method,
    cookies: request.cookies.getAll(),
  });

  let supabaseResponse = NextResponse.next({
    request,
  });

  let supabase;
  try {
    // Initialize Supabase client
    supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    console.log("[updateSession] Supabase client initialized successfully.");
  } catch (error) {
    console.error("[updateSession] Error initializing Supabase client:", error);
    return NextResponse.error(); // Return error response if Supabase fails to initialize
  }

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  // Allow all /auth path requests immediately
  if (request.nextUrl.pathname.startsWith("/auth")) {
    console.log(
      `[updateSession] Returning /auth path request immediately: ${request.nextUrl.pathname}`
    );
    return supabaseResponse;
  }

  // Check whether user is authenticated
  console.log("[updateSession] Fetching user...");
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("[updateSession] Error fetching user data:", error);
  }

  console.log("[updateSession] User data retrieved:", user);

  // If user is NOT authenticated, allow immediate access OR redirect to /sign-in page
  const loginRoutes = ["/sign-in", "/sign-up"];
  if (!user) {
    if (!loginRoutes.includes(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      if (request.nextUrl.pathname !== "/") {
        console.log(
          `[updateSession] Attaching next path parameter to response url: ${request.nextUrl.pathname}`
        );
        url.searchParams.set("next", request.nextUrl.pathname);
      }
      console.log(
        `[updateSession] Redirecting unauthenticated user from ${request.nextUrl.pathname} to ${url.pathname}.`
      );
      return NextResponse.redirect(url);
    } else {
      console.log(
        `[updateSession] Returning login path request immediately: ${request.nextUrl.pathname}`
      );
      return supabaseResponse;
    }
  }

  // Get the user's role using the custom getUserRole function
  console.log("[updateSession] Fetching user's role...");
  const role = await getUserRole();

  // If user is authenticated but doesn't have a valid role, redirect them to /assign-role
  if (user && !role && request.nextUrl.pathname !== "/assign-role") {
    const url = request.nextUrl.clone();
    url.pathname = "/assign-role";
    if (request.nextUrl.pathname !== "/") {
      console.log(
        `[updateSession] Attaching next path parameter to response url: ${request.nextUrl.pathname}`
      );
      url.searchParams.set("next", request.nextUrl.pathname);
    }
    console.log(
      `[updateSession] Redirecting user with invalid role from ${request.nextUrl.pathname} to ${url.pathname}.`
    );
    return NextResponse.redirect(url);
  }

  // If user is authenticated and requests a login route, redirect them to their homepage: /${role}
  if (
    user &&
    (loginRoutes.includes(request.nextUrl.pathname) ||
      request.nextUrl.pathname === "/")
  ) {
    console.log(
      `[updateSession] Redirecting authenticated user from ${request.nextUrl.pathname} to /${role}.`
    );
    const url = request.nextUrl.clone();
    url.pathname = `/${role}`;
    return NextResponse.redirect(url);
  }

  // Redirect roled users trying to access pages that are not their roles to home page

  const roleRoutes = ['profile', 'calendar', 'progress'] as const;

  if (
    user &&
    role && // Ensure role exists
    roleRoutes.some(path => request.nextUrl.pathname.startsWith("/" + path)) // Check if pathname starts with any roleRoutes
  ) {
    console.log(
      `[updateSession] Redirecting user from ${request.nextUrl.pathname} to /${role}/${request.nextUrl.pathname}`
    );
    const url = request.nextUrl.clone();
    url.pathname = `/${role}/${request.nextUrl.pathname}`;
    return NextResponse.redirect(url);
  }

  //

  if (user && role && roleRoutes.some(path => request.nextUrl.pathname.includes(path))) {
    const urlParts = request.nextUrl.pathname.split('/');
    const currentRole = urlParts[1];

    if (currentRole !== role && (currentRole == 'tutor' || currentRole == 'admin' || currentRole == 'student' || currentRole == 'parent')) {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}${request.nextUrl.pathname.substring(currentRole.length + 1)}`;
      return NextResponse.redirect(url);
    }
  }

  const universalPaths = ['messages', 'settings', 'support'] as const;

  if (
    user &&
    role && // Ensure role exists
    universalPaths.some(path => request.nextUrl.pathname.includes("/" + path)) // Check if pathname contains a universal path
  ) {
    const urlParts = request.nextUrl.pathname.split('/');
    const currentRole = urlParts[1];
    if (currentRole == 'tutor' || currentRole == 'admin' || currentRole == 'student' || currentRole == 'parent') {
      const url = request.nextUrl.clone();
      url.pathname = request.nextUrl.pathname.substring(currentRole.length + 1);
      return NextResponse.redirect(url);
    }
  }

  // Return the original supabase response
  console.log(
    `[updateSession] Returning original Supabase response: ${request.nextUrl.pathname}`
  );
  return supabaseResponse;
}
