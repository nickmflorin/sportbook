/**
 * Defines whether or not Prettier formatting rules should be enforced and auto-fixed as a part of the ESLint routine.
 *
 * This application is equipped with the Prettier formatting tool/package, which means that Prettier can be run outside
 * the context of ESLint (i.e. npx prettier -c . - which runs "prettier" checks on the codebase).  However, it is
 * sometimes useful for Prettier to be run as a part of ESLint.  To run Prettier as a part of ESLint, the ESLint
 * configuration must include:
 *
 * 1. "eslint-config-prettier": An ESLint configuration that turns off formatting-related rules that might conflict with
 *                              Prettier.
 * 2. "eslint-plugin-prettier": An ESLint plugin that contain implementations for additional Prettier-related rules that
 *                              ESLint will check for.  The plugin uses Prettier under the hood and will raise ESLint
 *                              errors when your code differs from Prettier's expected output.
 *
 * Including the "eslint-plugin-prettier" plugin and "eslint-config-prettier" can, at times, slow down your IDE
 * considerably - especially if "source.fixAll.eslint" (VSCode setting) is enabled.  For this reason, we will (for now)
 * allow the inclusion of Prettier in the ESLint routine to be toggled via this parameter.
 */
const INCLUDE_PRETTIER = true;

/** @type {(options?: { typescriptSupport: boolean }) => string[] } */
const getExtensions = options => {
  /* "prettier" must always be last, and "next/core-web-vitals" must always be first. */
  let baseExtensions = ["next/core-web-vitals"];
  if (options?.typescriptSupport === true) {
    baseExtensions = [...baseExtensions, "plugin:@typescript-eslint/recommended"];
  }
  if (INCLUDE_PRETTIER) {
    return [...baseExtensions, "prettier"];
  }
  return baseExtensions;
};

const FIRST_INTERNAL_MODULE_GROUP = ["prisma", "application", "lib", "internal", "tests"];

// Components and styles should always be the last absolute imports.
const SECOND_INTERNAL_MODULE_GROUP = ["components", "styles"];

const INTERNAL_MODULES = [...FIRST_INTERNAL_MODULE_GROUP, ...SECOND_INTERNAL_MODULE_GROUP];

const toAbsoluteImports = v => [`~/${v}`, `~/${v}/**`];

const IMPORT_ORDER_CONFIG = {
  groups: ["builtin", "external", "type", "internal", "parent", "sibling", "index", "object"],
  "newlines-between": "always",
  warnOnUnassignedImports: true,
  distinctGroup: false,
  pathGroupsExcludedImportTypes: ["react", "next"],
  pathGroups: [
    {
      pattern: "{react,react/**,next,next/**}",
      group: "builtin",
      position: "before",
    },
    {
      pattern: "{@prisma,@prisma/**}",
      group: "external",
      position: "after",
    },
    {
      pattern: "{../*}",
      group: "sibling",
      position: "before",
    },
    {
      pattern: "{./*}",
      group: "sibling",
      position: "after",
    },
    {
      pattern: `{${FIRST_INTERNAL_MODULE_GROUP.reduce((prev, v) => [...prev, ...toAbsoluteImports(v)], []).join(",")}}`,
      group: "internal",
      position: "before",
    },
    {
      pattern: `{${SECOND_INTERNAL_MODULE_GROUP.reduce((prev, v) => [...prev, ...toAbsoluteImports(v)], []).join(
        ",",
      )}}`,
      group: "internal",
      position: "before",
    },
  ],
  alphabetize: {
    order: "asc",
    caseInsensitive: true,
    orderImportKind: "asc",
  },
};

/* Rules that apply to all files in the project, regardless of file type. */
/** @type {import("eslint").Linter.Config["rules"]} */
let BASE_RULES = {
  curly: "error",
  "import/order": ["error", IMPORT_ORDER_CONFIG],
  "no-restricted-imports": [
    "error",
    {
      patterns: [
        {
          group: INTERNAL_MODULES.reduce((prev, v) => [...prev, `../${v}`, `../*/${v}`], []),
          message: "When outside of the module, absolute imports must be used for the directory.",
        },
      ],
    },
  ],
  "import/newline-after-import": ["error"],
  "import/no-duplicates": "error",
  "import/no-unresolved": "error",
  "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
  "max-len": [
    "warn",
    {
      code: 120,
      comments: 120,
      tabWidth: 2,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignorePattern: "\\/\\*\\s+eslint-disable-next-line(.?)+\\*\\/$",
    },
  ],
  "arrow-body-style": ["error", "as-needed"],
  "no-console": "error",
  "no-multiple-empty-lines": "error",
  "multiline-comment-style": ["warn", "bare-block"],
  "no-unexpected-multiline": "error",
  "object-curly-spacing": [1, "always"],
  "prefer-const": "error",
  quotes: [1, "double"],
  semi: [1, "always"],
};
if (INCLUDE_PRETTIER) {
  BASE_RULES = { ...BASE_RULES, "prettier/prettier": "error" };
}

/* Rules that apply to '.ts' or '.tsx' files. */
/** @type {import("eslint").Linter.Config["rules"]} */
const TS_BASE_RULES = {
  ...BASE_RULES,
  "@typescript-eslint/consistent-type-imports": [
    "warn",
    {
      prefer: "type-imports",
      fixStyle: "inline-type-imports",
    },
  ],
  /* The `no-explicit-any` rule does not play nicely with TypeScript when defining general forms of function or array
     types that require generic spread type arguments.  Specifying the 'ignoreRestArgs' rule alleviates the problem to
     some degree, but does not introduce type safety concerns. */
  "@typescript-eslint/no-explicit-any": ["error", { ignoreRestArgs: true }],
  "@typescript-eslint/no-non-null-assertion": "error",
  /* In TypeScript projects, the root "no-unused-vars" rule does not work properly with types, and sometimes clashes
     with the "@typescript-eslint" version of the rule.  The "@typescript-eslint" version covers all the cases that the
     root "no-unused-vars" rule does, but works properly with types - so it is used in favor of the root
     "no-unused-vars" rule, not in conjunction with. */
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  "react/jsx-newline": [1, { prevent: true }],
  "react/jsx-curly-brace-presence": [1, { props: "never", children: "never" }],
  "react/display-name": "off",
};

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: getExtensions(),
  plugins: INCLUDE_PRETTIER ? ["prettier"] : [],
  rules: BASE_RULES,
  parserOptions: {
    sourceType: "module",
  },
  ignorePatterns: [
    "next-env.d.ts",
    "!.*",
    "package.json",
    "package-lock.json",
    "src/prisma/migrations/*",
    "node_modules/*",
    ".next/*",
  ],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      extends: getExtensions({ typescriptSupport: true }),
      rules: TS_BASE_RULES,
    },
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "**/tests/utils/*"],
      extends: getExtensions({ typescriptSupport: true }),
      rules: {
        ...TS_BASE_RULES,
        // In tests, we need to use var-requires quite often when mocking.
        "@typescript-eslint/no-var-requires": 0,
      },
    },
    {
      files: ["**/*.md"],
      extends: getExtensions(),
      rules: {
        ...BASE_RULES,
        // This rule allows the formatter to automatically wrap text in markdown files at line 100.
        "prettier/prose-wrap": "error",
      },
    },
  ],
};
