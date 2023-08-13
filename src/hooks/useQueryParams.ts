"use client";
import { ReadonlyURLSearchParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useTransition } from "react";

import { useDeepEqualMemo } from "./useDeep";

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
  const updateParams = useDeepEqualMemo(
    () =>
      (
        params: Params<string, string | null | undefined>,
        options?: MutableOptions & { readonly clearOthers?: true },
      ): MutableReturnType => {
        const newParams = options?.clearOthers ? new URLSearchParams() : new URLSearchParams(searchParams.toString());

        /* First, add all of the existing query parameters to the set as long as they are not in the set of new
         parameters. */
        for (const param in searchParams) {
          // If the existing parameter is not in the new set of provided parameters, leave it in the set of parameters.
          if (params[param] === undefined) {
            const currentValue = searchParams.get(param);
            if (currentValue !== null) {
              newParams.set(param, currentValue);
            }
          }
        }
        const isClearableValue = (v: string | null | undefined): v is string | null =>
          v === null || (typeof v === "string" && v.length === 0);

        /* Loop over the keys of the params so that we can tell the difference between a parameter that is included with
           an explicitly undefined value and a parameter that is not included at all. */
        for (const param in params) {
          const value = params[param];
          // The new set of parameters will only have the parameter if the clearOthers flag is not true.
          if (isClearableValue(value) && newParams.has(param)) {
            newParams.delete(param);
          } else if (!isClearableValue(value) && value !== undefined) {
            newParams.set(param, value);
          }
        }
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
    [searchParams, pathname, push],
  );

  const parseParams = useDeepEqualMemo(
    () =>
      <K extends string>(names?: K[]): Params<K, string> | null => {
        let parsed: Record<K, string> = {} as Record<K, string>;
        if (names === undefined) {
          for (const [key, value] of searchParams) {
            if (value !== null && value.length !== 0) {
              parsed = { ...parsed, [key as K]: value };
            }
          }
        } else {
          for (const p of names) {
            const value = searchParams.get(p);
            if (value !== null && value.length !== 0) {
              parsed = { ...parsed, [p]: value };
            }
          }
        }
        return Object.keys(parsed).length !== 0 ? parsed : null;
      },
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
