import { type ReadonlyURLSearchParams } from "next/navigation";

import { isUuid } from "~/lib/schemas";

import { prisma } from "./client";

type ParseQueryParamIdSearchOptions = {
  params: ReadonlyURLSearchParams;
  key: string;
  value?: never;
};

type ParseQueryParamIdParamOptions<V = string | null | undefined> = {
  params?: never;
  key?: never;
  value: V;
};

type ParseQueryParamIdOptions<V = string | null | undefined> =
  | ParseQueryParamIdParamOptions<V>
  | ParseQueryParamIdSearchOptions;

export function parseQueryParamIds({ params, key, value }: ParseQueryParamIdOptions): string[] {
  if (params !== undefined && key !== undefined) {
    return parseQueryParamIds({ value: params.get(key) });
  } else if (value === undefined || value === null) {
    return [];
  }
  const decoded = decodeURIComponent(value);
  return decoded
    .split(",")
    .map(id => id.trim())
    .filter(isUuid);
}

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
