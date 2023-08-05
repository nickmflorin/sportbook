import { type NextRequest } from "next/server";

import { prisma } from "~/prisma/client";
import { AppResponse } from "~/app/api/response";
import { getAuthUserFromRequest } from "~/server/auth";

// TODO: This is not currently used - might want to remove it.
export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request);
  if (!user) {
    return AppResponse.NOT_AUTHORIZED();
  }
  const locations = await prisma.location.findMany({ where: { createdById: user.id } });
  return AppResponse.OK(locations);
}
