/*
This script is used for purposes of loading environment variables into the environment for purposes of running certain
npm scripts.  The script uses the 'dotenv' package to parse the environment variable files and then the npm script uses
the 'env-cmd' command to load the environment variables exported from this file into the environment.

The script addresses the following problem: how do we set environment variables for an npm script that is run before
NextJS loads the environment when those variables cannot be inlined in the script command due to security concerns?

For example, the following works:

/ - package.json - /
"scripts": {
  "my-command": MY_ENV_VAR=foo npm run test
}

However, if MY_ENV_VAR is a sensitive value, we cannot inline it in the package.json.  Instead, we must load it from the
environment variables defined in files that are not committed to source control (i.e. any environment variable that
is suffixed with .local).

By default, the 'env-cmd' command will read environment variables from a `.env` file - but we need it to read
environment variables from `.env.*.local` files.  This script addresses that problem.

See: https://www.npmjs.com/package/env-cmd
See: https://www.npmjs.com/package/dotenv
*/

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const dotenv = require("dotenv");

const REQUIRED_ENVIRONMENT_VARIABLES = ["FONT_AWESOME_AUTH_TOKEN"];

const NEXT_JS_ENVIRONMENT_VARIABLE_FILES = {
  development: [".env", ".env.development", ".env.local", ".env.development.local"],
  production: [".env", ".env.production", ".env.local", ".env.production.local"],
  all: [".env", ".env.local"],
};

const loadNextJSEnvironmentVariables = (environment, variables) => {
  let ENV = {};
  for (const filename of NEXT_JS_ENVIRONMENT_VARIABLE_FILES[environment]) {
    if (filename === undefined) {
      throw new Error("");
    }
    const parsed = dotenv.config({ path: filename });
    if (parsed.error) {
      /* eslint-disable-next-line no-console */
      console.warn(`Could not load environment variables at path ${filename}.`);
    } else {
      for (const v of variables) {
        if (parsed.parsed[v] !== undefined) {
          ENV = { ...ENV, [v]: parsed.parsed[v] };
        }
      }
    }
  }
  for (const v of variables) {
    if (ENV[v] === undefined) {
      throw new Error(
        `The environment variable '${v}' is required for this npm script but was not found in the environment!`,
      );
    }
  }
  return ENV;
};

module.exports = {
  development: loadNextJSEnvironmentVariables("development", REQUIRED_ENVIRONMENT_VARIABLES),
  production: loadNextJSEnvironmentVariables("production", REQUIRED_ENVIRONMENT_VARIABLES),
  all: loadNextJSEnvironmentVariables("all", REQUIRED_ENVIRONMENT_VARIABLES),
};
