const FIRST_INTERNAL_MODULE_GROUP = ["application", "lib", "tests", "server", "hooks", "app"];

// Components and styles should always be the last absolute imports.
const SECOND_INTERNAL_MODULE_GROUP = ["components", "styles"];

const toAbsoluteImports = v => [`~/${v}`, `~/${v}/**`];

/* Rules that apply to all files in the project, regardless of file type. */
/** @type {import("eslint").Linter.Config["rules"]} */
const BASE_RULES = {
  "prettier/prettier": "error",
  curly: "error",
  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "type", "internal", "parent", "sibling", "index", "object"],
      "newlines-between": "always",
      warnOnUnassignedImports: true,
      distinctGroup: false,
      pathGroupsExcludedImportTypes: ["react", "next"],
      pathGroups: [
        {
          pattern: "server-only",
          group: "builtin",
          position: "before",
        },
        {
          pattern: "{react,react/**,next,next/**}",
          group: "builtin",
          position: "after",
        },
        {
          pattern: "{@prisma,@prisma/**,prisma,prisma/**,server,server/**,application,application/**}",
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
          pattern: `{${FIRST_INTERNAL_MODULE_GROUP.reduce((prev, v) => [...prev, ...toAbsoluteImports(v)], []).join(
            ",",
          )}}`,
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
  // This should eventually be an error...
  "no-console": "warn",
  "no-unused-vars": "warn",
  "no-multiple-empty-lines": "error",
  "multiline-comment-style": ["warn", "bare-block"],
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
  "@typescript-eslint/no-unused-vars": ["warn", { destructuredArrayIgnorePattern: "^_" }],
  "react/jsx-newline": [1, { prevent: true }],
  "react/jsx-curly-brace-presence": [1, { props: "never", children: "never" }],
  "react/display-name": "off",
};

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended", "prettier"],
  plugins: ["prettier"],
  rules: BASE_RULES,
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
      rules: TS_BASE_RULES,
    },
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "**/tests/utils/*"],
      rules: {
        ...TS_BASE_RULES,
        // In tests, we need to use var-requires quite often when mocking.
        "@typescript-eslint/no-var-requires": 0,
      },
    },
    {
      files: ["**/*.md"],
      rules: {
        ...BASE_RULES,
        // This rule allows the formatter to automatically wrap text in markdown files at line 100.
        "prettier/prose-wrap": "error",
      },
    },
  ],
};
