import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // check logged in or not
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // no user = go to login
  if (!user && request.nextUrl.pathname !== "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  let role = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role;
  }

  //if we aren't trying to logout

  if (!request.nextUrl.pathname.startsWith("/auth")) {
    // go to home if u have a role and assigntype if not
    if (request.nextUrl.pathname === "/login" && user) {
      const url = request.nextUrl.clone();
      url.pathname = role ? `/${role}` : "/assigntype";
      return NextResponse.redirect(url);
    }

    //if ur logged in and u try to go to assigntype, go home
    if (request.nextUrl.pathname.startsWith("/assigntype") && user) {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}`;
      return NextResponse.redirect(url);
    }

    // literally go to assigntype if u dont have a role
    if (user && !role && request.nextUrl.pathname !== "/assigntype") {
      const url = request.nextUrl.clone();
      url.pathname = "/assigntype";
      return NextResponse.redirect(url);
    }

    const originalPath = request.nextUrl.pathname;

    // send people to role-appropriate link
    if (originalPath.startsWith("/tutor") && role !== "tutor") {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}`;
      return NextResponse.redirect(url);
    }

    if (originalPath.startsWith("/student") && role !== "student") {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}`;
      return NextResponse.redirect(url);
    }

    if (originalPath.startsWith("/parent") && role !== "parent") {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}`;
      return NextResponse.redirect(url);
    }

    // if you are on a link without role then proceed to /role/link without infinite loop
    if (role && !request.nextUrl.pathname.startsWith(`/${role}`)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${role}${request.nextUrl.pathname}`;
      return NextResponse.redirect(url);
    }
  }



  return supabaseResponse;
}
