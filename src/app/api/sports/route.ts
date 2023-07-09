import { AppResponse } from "~/server/api";
import { prisma } from "~/server/db";

export async function GET(request: Request) {
  const sports = await prisma.sport.findMany({});
  return AppResponse.OK(sports);
}
