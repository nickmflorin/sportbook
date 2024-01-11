import { type NextRequest } from "next/server";

import { ServerResponse } from "~/application/response";
import { getAuthUserFromRequest } from "~/server/auth";
import { prisma } from "~/prisma/client";

// TODO: This is not currently used - might want to remove it.
export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request);
  if (!user) {
    return ServerResponse.NotAuthenticated().toResponse();
  }
  const locations = await prisma.location.findMany({ where: { createdById: user.id } });
  return ServerResponse.OK(locations).toResponse();
}
