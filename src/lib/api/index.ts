import { env } from "~/env.mjs";

export const getAbsoluteApiUrl = () => {
  if (process.env.NODE_ENV === "production") {
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
