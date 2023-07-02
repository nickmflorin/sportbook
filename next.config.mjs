import { fileURLToPath } from "url";

import path from "path";
import StylelintPlugin from "stylelint-webpack-plugin";

/* Avoids the error: "ReferenceError: __dirname is not defined in ES module scope", which occurs if you refer to the
   __dirname global variable in an ES (ECMAScript) module.

  See: https://www.decodingweb.dev/dirname-is-not-defined-in-es-module-scope-fix */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the environment file to perform validation before build.
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  webpack: config => {
    /* The StylelintPlugin requires the addition to the package.json: "postcss": "^8.4.18". */
    config.plugins.push(new StylelintPlugin());
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/dashboard",
      permanent: false,
    },
  ],
};

export default config;
