"use client";
import { ReadonlyURLSearchParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useTransition } from "react";

import { parseQueryParams, updateQueryParams } from "~/lib/util/urls";

import { useDeepEqualMemo } from "./useDeep";
import { useReferentialCallback } from "./useReferentialCallback";

type Params<K extends string = string, V extends string | null | undefined = string | null> = Record<K, V>;

type MutableReturnType = {
  readonly href: string;
  readonly queryString: string | null;
  readonly params: ReadonlyURLSearchParams;
};

type MutableOptions = {
  readonly push?: true;
  readonly useTransition?: false;
};

export interface IQueryParams {
  readonly params: ReadonlyURLSearchParams;
  readonly pathname: string;
  readonly pending: boolean;
  readonly parseParams: <K extends string = string>(params?: K[]) => Params<K, string> | null;
  readonly clearParams: <K extends string = string>(params?: K[], options?: MutableOptions) => MutableReturnType;
  readonly updateParams: (
    /* When updating the parameters, undefined is an allowed value - an undefined value will simplly be ignored (where
       as a null value will remove the parameter). */
    params: Params<string, string | null | undefined>,
    options?: MutableOptions & { readonly clearOthers?: true },
  ) => MutableReturnType;
}

export const useQueryParams = (): IQueryParams => {
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const { push } = useRouter();
  const pathname = usePathname();

  /* Use a deep equality check for the memoization to prevent the function from changing its reference whenever the
     URL or pathname changes.  If the URL or pathname changes, the searchParams object will have a different reference,
     even if the actual query parameters and their values remains the same. */
  const updateParams = useReferentialCallback(
    (
      params: Params<string, string | null | undefined>,
      options?: MutableOptions & { readonly clearOthers?: true },
    ): MutableReturnType => {
      const toUpdate = options?.clearOthers ? new URLSearchParams() : new URLSearchParams(searchParams.toString());
      const newParams = updateQueryParams(toUpdate, params);

      let href = pathname;
      const queryString = newParams.toString();
      if (newParams.size !== 0 && queryString.length !== 0) {
        href = `${pathname}?${queryString}`;
      }

      if (options?.push === true) {
        if (options?.useTransition !== false) {
          startTransition(() => push(href));
        } else {
          push(href);
        }
      }
      return { params: new ReadonlyURLSearchParams(newParams), queryString, href };
    },
  );

  const parseParams = useMemo(
    () =>
      <K extends string>(names?: K[]): Params<K, string> | null =>
        parseQueryParams(searchParams, { params: names }),
    [searchParams],
  );

  const clearParams = useMemo(
    () =>
      <K extends string>(names?: K[], options?: MutableOptions) => {
        if (names === undefined) {
          return updateParams({}, { ...options, clearOthers: true });
        }
        const nullableParams = names.reduce(
          (prev: Params<K, null>, curr: K) => ({ ...prev, [curr]: null }),
          {} as Params<K, null>,
        );
        return updateParams(nullableParams, { ...options });
      },
    [updateParams],
  );

  return { params: searchParams, pathname, pending, updateParams, clearParams, parseParams };
};

export interface IParsedQueryParams<K extends string> extends Omit<IQueryParams, "parseParams"> {
  readonly parsed: Record<K, string> | null;
}

export interface UseParsedQueryParamsConfig<K extends string> {
  readonly params: K[];
}

export const useParsedQueryParams = <K extends string>({
  params: paramNames,
}: UseParsedQueryParamsConfig<K>): IParsedQueryParams<K> => {
  const { parseParams, ...others } = useQueryParams();
  const parsed = useDeepEqualMemo(() => parseParams(paramNames), [parseParams, paramNames]);
  return { ...others, parsed };
};
