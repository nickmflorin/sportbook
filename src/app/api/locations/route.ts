import { type NextRequest } from "next/server";

import { AppResponse } from "~/lib/api";
import { getAuthUserFromRequest } from "~/lib/auth";
import { prisma } from "~/prisma/client";

export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request);
  if (!user) {
    return AppResponse.NOT_AUTHORIZED();
  }
  const locations = await prisma.location.findMany({ where: { createdById: user.id } });
  return AppResponse.OK(locations);
}
