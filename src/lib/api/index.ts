import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "~/server/api/root";

import { env } from "~/env.mjs";

export const getApiUrl = () => {
  // The browser should use a relative URL.
  if (typeof window !== "undefined") {
    return "/api";
  } else if (process.env.NODE_ENV === "production") {
    if (env.VERCEL_URL === undefined) {
      // This should be validated by the environment variable configuration on startup.
      throw new TypeError(`The environment variable 'VERCEL_URL' is unexpectedly not defined!`);
    }
    return `${env.API_SCHEME}://${process.env.VERCEL_URL}/api`;
  } else if (env.API_HOST === undefined) {
    // This should be validated by the environment variable configuration on startup.
    throw new TypeError(`The environment variable 'API_HOST' is unexpectedly not defined!`);
  } else if (env.API_PORT !== undefined) {
    return `${env.API_SCHEME}://${process.env.API_HOST}:${env.API_PORT}/api`;
  }
  return `${env.API_SCHEME}://${process.env.API_HOST}/api`;
};

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getApiUrl()}/trpc`,
        }),
      ],
    };
  },
  ssr: false,
});

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
