import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/"],
  // afterAuth: (auth, req, evt) => {
  //   if (req.nextUrl.pathname.startsWith("/api")) {
  //     const r = NextResponse.next();
  //     console.log({ r, path: req.nextUrl.pathname });
  //     return r;
  //   }
  // },
});

// export function middleware(request: NextRequest) {

//   return NextResponse.redirect(new URL('/home', request.url))
// }

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
