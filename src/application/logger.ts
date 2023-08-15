import { env } from "~/env.mjs";

import { createHotReloadIsolatedFn } from "./util";

const initializeLogger = () => {
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const pino = require("pino").default;

  /* eslint-disable-next-line @typescript-eslint/consistent-type-imports */
  const loggerOptions: import("pino").LoggerOptions = {
    browser: {},
    level: env.NEXT_PUBLIC_LOG_LEVEL,
    base: {
      env: process.env.NODE_ENV,
      revision: env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    },
  };
  if (typeof window === "undefined" && env.PRETTY_LOGGING === true) {
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    const pretty = require("pino-pretty");
    return pino(loggerOptions, pretty({ colorize: true }));
  }
  return pino(loggerOptions);
};

export const logger = createHotReloadIsolatedFn("logger", initializeLogger);
