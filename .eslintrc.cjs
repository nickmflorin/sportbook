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
  ],
  alphabetize: {
    order: "asc",
    caseInsensitive: true,
    orderImportKind: "asc",
  },
};

/* Rules that apply to all files in the project, regardless of file type. */
/** @type {import("eslint").Linter.Config["rules"]} */
const BASE_RULES = {
  "prettier/prettier": "error",
  curly: "error",
  "import/order": ["error", IMPORT_ORDER_CONFIG],
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
  "no-console": "error",
  "no-multiple-empty-lines": "error",
  "no-unexpected-multiline": "error",
  "object-curly-spacing": [1, "always"],
  "prefer-const": "error",
  quotes: [1, "double"],
  semi: [1, "always"],
};

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
  "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  "react/jsx-newline": [1, { prevent: true }],
  "react/jsx-curly-brace-presence": [1, { props: "never", children: "never" }],
};

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals", "prettier"],
  plugins: ["prettier"],
  rules: BASE_RULES,
  ignorePatterns: [
    "next-env.d.ts",
    "!.*",
    "package.json",
    "package-lock.json",
    "prisma/migrations/*",
    "*.generated.ts",
  ],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      // "prettier" must always be last, and "next/core-web-vitals" must always be first.
      extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended", "prettier"],
      rules: TS_BASE_RULES,
    },
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "**/tests/utils/*"],
      // "prettier" must always be last, and "next/core-web-vitals" must always be first.
      extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended", "prettier"],
      rules: {
        ...TS_BASE_RULES,
        // In tests, we need to use var-requires quite often when mocking.
        "@typescript-eslint/no-var-requires": 0,
      },
    },
    {
      files: ["**/*.md"],
      extends: ["next/core-web-vitals", "prettier"],
      rules: {
        ...BASE_RULES,
        // This rule allows the formatter to automatically wrap text in markdown files at line 100.
        "prettier/prose-wrap": "error",
      },
    },
  ],
};
