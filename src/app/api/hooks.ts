import superjson from "superjson";
import { type SuperJSONResult } from "superjson/dist/types";
import useRootSWR, { type SWRResponse as RootSWRResponse } from "swr";
import { type SWRConfiguration } from "swr/_internal";

import { type ServerErrorResponseBody, isServerErrorResponseBody } from "~/application/response";
import { type Sport, type Location, type User } from "~/prisma/model";

type FetchResponseBody = { data: SuperJSONResult } | SuperJSONResult;

const isSuccessResponseBody = (b: FetchResponseBody): b is { data: SuperJSONResult } =>
  typeof b === "object" && b !== null && (b as { data: SuperJSONResult }).data != undefined;

export const swrFetcher = async <T>(url: string) => {
  const response = await fetch(url);

  const json: FetchResponseBody = await response.json();
  if (isSuccessResponseBody(json)) {
    const deserialized = superjson.deserialize(json.data);
    if (deserialized === undefined) {
      throw new Error(`Corrupted API response received for fetch at URL '${url}'!`);
    }
    // TODO: We might want to incorporate zod schemas for type validation here - the type safety needs to be improved.
    return deserialized as T;
  }
  const deserialized = superjson.deserialize(json);
  if (isServerErrorResponseBody(deserialized)) {
    return deserialized;
  }
  throw new Error(`Corrupted API response received for fetch at URL '${url}'!`);
};

export type SWRConfig<T> = Omit<
  SWRConfiguration<T | ServerErrorResponseBody>,
  /* The 'shouldRetryOnError' configuration parameter is set globally in the <SWRConfig> component and should not be
     overridden. */
  "shouldRetryOnError" | "onError" | "onSuccess"
> & {
  readonly onError?: (e: ServerErrorResponseBody | Error) => void;
  readonly onSuccess?: (data: T) => void;
};

export type SWRResponse<T> = RootSWRResponse<T, Error | ServerErrorResponseBody>;

export type OnError<T> = SWRConfig<T>["onError"];

export const useSWR = <T>(url: string, config?: SWRConfig<T>): SWRResponse<T> => {
  const { data, error, ...others } = useRootSWR(url, swrFetcher<T>, {
    ...config,
    onSuccess: (data: T | ServerErrorResponseBody) => {
      if (isServerErrorResponseBody(data)) {
        config?.onError?.(data);
      } else {
        config?.onSuccess?.(data);
      }
    },
  });
  if (data !== undefined && isServerErrorResponseBody(data)) {
    // Here, the error will not be defined if the data is defined.
    return { data: undefined, error: data, ...others } as SWRResponse<T>;
  }
  return { data, error, ...others } as SWRResponse<T>;
};

export const useSports = (config?: SWRConfig<Sport[]>) => useSWR<Sport[]>("/api/sports", config);

export const useLocations = (config?: SWRConfig<Location[]>) => useSWR<Location[]>("/api/locations", config);

export const useLeagueAvailableUsers = (leagueId: string, config?: SWRConfig<User[]>) =>
  useSWR<User[]>(`/api/leagues/${leagueId}/users`, config);
