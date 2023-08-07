"use client";
import { ReadonlyURLSearchParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useTransition } from "react";

type Params = Record<string, string | null | undefined>;

export interface IMutableSearchParams {
  readonly searchParams: ReadonlyURLSearchParams;
  readonly pending: boolean;
  readonly updateParams: (
    params: Params,
    options?: { push?: boolean },
  ) => { searchParams: ReadonlyURLSearchParams; queryString: string | null; path: string };
}

export const useMutableSearchParams = (): IMutableSearchParams => {
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const updateParams = useMemo(
    () => (params: Params, options?: { push?: boolean }) => {
      const newParams = new URLSearchParams(searchParams.toString());

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

      for (const param in params) {
        const value = params[param];
        // If the new parameter is null or undefined, remove it from the set of parameters.
        if ((value === null || (typeof value === "string" && value.length === 0)) && newParams.has(param)) {
          newParams.delete(param);
        } else if (value !== null && value !== undefined && value.length !== 0) {
          newParams.set(param, value);
        }
      }
      let queryString = "";
      let path = pathname;
      if (newParams.size !== 0) {
        queryString = newParams.toString();
        if (queryString.length !== 0) {
          path = `${pathname}?${queryString}`;
        }
      }

      if (options?.push === true) {
        startTransition(() => {
          router.push(path);
        });
      }
      return { searchParams: new ReadonlyURLSearchParams(newParams), queryString, path };
    },
    [searchParams, pathname, router],
  );

  return { searchParams, pending, updateParams };
};
