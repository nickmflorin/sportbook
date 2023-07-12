import superjson from "superjson";
import { type SuperJSONResult } from "superjson/dist/types";
import useRootSWR, { type SWRResponse } from "swr";
import { type SWRConfiguration } from "swr/_internal";

import { type Sport } from "~/prisma";

type FetchResponseBody = { data: SuperJSONResult };

export const swrFetcher = async <T>(url: string) => {
  // TODO: Properly classify network vs. client errors and develop a protocol for communicating them.
  const response = await fetch(url);

  /* TODO: In certain cases, we may not want to funnel errors through to the useSWR return ("error" key).  For
     instance, we may want to throw hard errors if the response is not JSON serializable. */
  const json: FetchResponseBody = await response.json();
  if (json.data === undefined) {
    throw new Error(`Corrupted API response received for fetch at URL '${url}'!`);
  }
  // TODO: Use zod to validate that the structure of 'json.data' is in fact a SuperJSONResult.
  const deserialized = superjson.deserialize(json.data);
  if (deserialized === undefined) {
    throw new Error(`Corrupted API response received for fetch at URL '${url}'!`);
  }
  // TODO: We might want to incorporate zod schemas for type validation here - the type safety needs to be improved.
  return deserialized as T;
};

export type SWRConfig<T> = Omit<
  SWRConfiguration<T>,
  /* The 'shouldRetryOnError' configuration parameter is set globally in the <SWRConfig> component and should not be
     overridden. */
  "shouldRetryOnError"
>;

export type OnError<T> = SWRConfig<T>["onError"];

export const useSWR = <T>(url: string, config?: SWRConfig<T>): SWRResponse<T> => useRootSWR(url, swrFetcher<T>, config);

export type OnSportsError = OnError<Sport[]>;

export const useSports = (config?: SWRConfig<Sport[]>) => useSWR<Sport[]>("/api/sports", config);
