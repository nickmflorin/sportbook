import pino, { type LoggerOptions } from "pino";

import { env } from "~/env.mjs";

const initializeLogger = () => {
  const loggerOptions: LoggerOptions = {
    browser: {},
    level: env.NEXT_PUBLIC_LOG_LEVEL,
    base: {
      env: process.env.NODE_ENV,
      revision: env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    },
  };
  // if (typeof window === "undefined" && env.PRETTY_LOGGING === true) {
  //   /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  //   const pretty = require("pino-pretty");
  //   return pino(loggerOptions, pretty({ colorize: true }));
  // }
  return pino(loggerOptions);
};

export const logger = initializeLogger();
