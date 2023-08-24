import path from "path";
import { fileURLToPath } from "url";

import withBundleAnalyzer from "@next/bundle-analyzer";
import withBundleStats from "next-plugin-bundle-stats";
import StylelintPlugin from "stylelint-webpack-plugin";

/* Avoids the error: "ReferenceError: __dirname is not defined in ES module scope", which occurs if you refer to the
   __dirname global variable in an ES (ECMAScript) module.

  See: https://www.decodingweb.dev/dirname-is-not-defined-in-es-module-scope-fix */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the environment file to perform validation before build.
const { env } = await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  experimental: {
    serverActions: true,
  },
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
  images: {
    domains: ["images.clerk.dev"],
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/dashboard",
      permanent: false,
    },
  ],
  modularizeImports: {
    "@mantine/core/lib/Checkbox": {
      transform: "@mantine/core/esm/Checkbox/Checkbox.js",
      skipDefaultConversion: true,
      preventFullImport: true,
    },
    "@mantine/core/lib/Switch": {
      transform: "@mantine/core/esm/Switch/Switch.js",
      skipDefaultConversion: true,
      preventFullImport: true,
    },
    "@mantine/core/lib/TextInput": {
      transform: "@mantine/core/esm/TextInput/TextInput.js",
      skipDefaultConversion: true,
      preventFullImport: true,
    },
    "@mantine/core/lib/Textarea": {
      transform: "@mantine/core/esm/Textarea/Textarea.js",
      skipDefaultConversion: true,
      preventFullImport: true,
    },
    "@mantine/core/lib/Select": {
      transform: "@mantine/core/esm/Select/Select.js",
      skipDefaultConversion: true,
      preventFullImport: true,
    },
    "@mantine/core/lib/MultiSelect": {
      transform: "@mantine/core/esm/MultiSelect/MultiSelect.js",
      skipDefaultConversion: true,
      preventFullImport: true,
    },
    "@mantine/core/lib/Popover": {
      transform: "@mantine/core/esm/Popover/Popover.js",
      skipDefaultConversion: true,
      preventFullImport: true,
    },
    "@mantine/core/lib/HoverCard": {
      transform: "@mantine/core/esm/HoverCard/HoverCard.js",
      skipDefaultConversion: true,
      preventFullImport: true,
    },
    "@mantine/dates/lib/components/DateInput": {
      transform: "@mantine/dates/esm/components/DateInput/DateInput.js",
      skipDefaultConversion: true,
      preventFullImport: true,
    },
  },
};

/* const bundled = withBundleStats({
     outDir: "./stats",
   })(config); */

const bundled = (phase, { defaultConfig }) =>
  withBundleAnalyzer({ enabled: env.ANALYZE_BUNDLE && phase === "phase-production-build" })({
    ...defaultConfig,
    ...config,
  });

export default bundled;

/* export default function configuration(phase, defaultConfig) {
     if (phase === BuildPh) {
       return withBundleAnalyzer(defaultConfig);
     }
   } */

/* export default withBundleAnalyzer(config, {
     enabled: process.env.NODE_ENV === "production" && process.env.ANALYZE_BUNDLE === "true",
   }); */
