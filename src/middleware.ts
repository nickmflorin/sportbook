import clerk from "@clerk/clerk-sdk-node";
import { authMiddleware } from "@clerk/nextjs";

// import { prisma } from "~/server/db";

export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth: async params => {
    if (params.sessionId && (params.user || params.userId)) {
      console.log({ isServer: typeof window === "undefined" });
      const prisma = await import("~/server/db").then(mod => mod.prisma);
      if (params.user) {
        const prisma = await import("~/server/db").then(mod => mod.prisma);
        prisma.user.syncWithClerk(params.user);
      } else {
        const user = await clerk.users.getUser(params.userId);
        const prisma = await import("~/server/db").then(mod => mod.prisma);
        prisma.user.syncWithClerk(user);
      }
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
