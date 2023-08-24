import { type ReadonlyURLSearchParams } from "next/navigation";

import { isUuid } from "~/lib/schemas";

export type ParseQueryParamIdSearchOptions = {
  params: ReadonlyURLSearchParams;
  key: string;
  value?: never;
};

export type ParseQueryParamIdParamOptions<V = string | null | undefined> = {
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
