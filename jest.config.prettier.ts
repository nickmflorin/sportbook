import { withLintConfig } from "./jest.config.lint";

export default withLintConfig(__dirname, {
  displayName: "Prettier",
  runner: "jest-runner-prettier",
});
