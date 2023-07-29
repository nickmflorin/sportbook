"use client";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useMutableSearchParams = () => {
  const searchParams = useSearchParams();

  const updateParams = useMemo(
    () => (params: Record<string, string | null | undefined>) => {
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
        if ((value === null || (typeof value === "string" && value.length === 0)) && newParams.has(param)) {
          newParams.delete(param);
        } else if (value !== null && value !== undefined && value.length !== 0) {
          newParams.set(param, value);
        }
        // If the new parameter is null or undefined, remove it from the set of parameters.
        if (params[param] === null || params[param] === undefined) {
          newParams.delete(param);
          continue;
        }
      }
      const queryString = newParams.toString();
      return { searchParams: newParams, queryString: queryString.length !== 0 ? queryString : null };
    },
    [searchParams],
  );

  return { searchParams, updateParams };
};
