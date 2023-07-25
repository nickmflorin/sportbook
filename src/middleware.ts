import { NextResponse } from "next/server";

import { authMiddleware } from "@clerk/nextjs";

import { createLeadingPathRegex, isUuid } from "./lib/util/paths";

const DO_NOT_REDIRECT = "DO_NOT_REDIRECT" as const;
type DO_NOT_REDIRECT = "DO_NOT_REDIRECT";

type DynamicRedirect = {
  readonly pathRegex: RegExp;
  readonly redirectUrl: (result: ReturnType<RegExp["exec"]>) => string | DO_NOT_REDIRECT;
};

const DynamicRedirects: DynamicRedirect[] = [
  {
    pathRegex: createLeadingPathRegex("/leagues/:id"),
    redirectUrl: (result: ReturnType<RegExp["exec"]>) => {
      if (result && result[1] && isUuid(result[1])) {
        /* Note: We may need to worry about query parameters or other parts of the URL - but it is unlikely, since this
           redirect would likely only occur if a User is manually visiting /leagues/:id. */
        return `/leagues/${result[1]}/standings`;
      }
      return DO_NOT_REDIRECT;
    },
  },
];

export default authMiddleware({
  beforeAuth: req => {
    const pathname = req.nextUrl.pathname;
    for (const { pathRegex, redirectUrl } of DynamicRedirects) {
      const execResult = pathRegex.exec(pathname);
      const redirect = redirectUrl(execResult);
      if (redirect !== DO_NOT_REDIRECT) {
        return NextResponse.redirect(new URL(redirect, req.nextUrl));
      }
    }
    return NextResponse.next();
  },
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
