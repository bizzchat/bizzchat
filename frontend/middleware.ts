import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

import { NextResponse, type NextRequest } from "next/server";
import { Database } from "./types/supabase";

const protectedPaths = ["/chat", "/admin"];
const publicDefault = "/login";
const protectedDefault = "/chat";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const redirectUrl = req.nextUrl.clone();

  if (session) {
    if (!(req.nextUrl.pathname === publicDefault)) {
      return res;
    }
    redirectUrl.pathname = protectedDefault;
  } else {
    if (!protectedPaths.includes(req.nextUrl.pathname)) {
      return res;
    }
    redirectUrl.pathname = publicDefault;
  }

  return NextResponse.redirect(redirectUrl);
}
