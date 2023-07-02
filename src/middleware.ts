// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// import { withClerkMiddleware, getAuth } from "@clerk/nextjs/server";

console.log("LOADING MIDDLEWARE 2");
// import { pathIsPublic } from "./config/paths";
import { authMiddleware } from "@clerk/nextjs";

// const middleware = (request: NextRequest) => {
//   // If the requested page is a publically available page, simply proceed.
//   if (pathIsPublic(request.nextUrl.pathname)) {
//     return NextResponse.next();
//   }
//   const { userId, orgId } = getAuth(request);

//   /* In the case that the user is not authenticated (i.e. there is no user), redirect them to the login page. */
//   if (!userId) {
//     const signInUrl = new URL("/sign-in", request.url);
//     signInUrl.searchParams.set("redirect_url", request.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   if (!orgId) {
//     const orgSwitchUrl = new URL("/switch-org", request.url);
//     orgSwitchUrl.searchParams.set("redirect_url", request.url);
//     return NextResponse.redirect(orgSwitchUrl);
//   }
//   return NextResponse.next();
// };

// export const config = {
//   matcher:
//     "/((?!_next/image|_next/static|favicon.ico|logo.png|api/rest|.well-known).*)",
// };
// import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/getAuthenticatedUserId"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
