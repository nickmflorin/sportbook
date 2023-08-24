import "server-only";

import { prisma } from "~/prisma/client";
import { parseQueryParamIds, type ParseQueryParamIdParamOptions } from "~/prisma/urls";

export async function parseQueryTeamIds({
  params,
  key,
  value,
}: ParseQueryParamIdParamOptions<string | null | undefined | string[]>): Promise<string[]> {
  if (Array.isArray(value)) {
    return (await prisma.team.findMany({ where: { id: { in: value } }, select: { id: true } })).map(t => t.id);
  }
  return parseQueryTeamIds({ value: parseQueryParamIds({ params, key, value }) });
}
