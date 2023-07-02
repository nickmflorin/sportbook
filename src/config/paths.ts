// Paths that do not require an authenticated user.
export const PUBLIC_PATHS: RegExp[] = [
  /^\/$/,
  /^\/sign-in($|\/)/,
  /^\/sign-up($|\/)/,
  /^\/switch-org($|\/)/,
];

/**
 * Returns whether or not the provided path, {@link string}, is considered "public" (i.e. the path does not require an
 * authenticated user).
 *
 * @param {string} path The applicable path.
 * @returns {boolean} Whether or not the path is "public".
 */
export const pathIsPublic = (path: string): boolean =>
  PUBLIC_PATHS.find((x) => path.match(x)) !== undefined;

export const UUID_PATH_PARAM_REGEX_STRING = "([0-9a-zA-z-]+)";
export const PATH_END_REGEX_STRING = "(?:\\/)?(\\?([^\\/]+)?(\\/)?)?$";

/**
 * Creates a regular expression that can be used to match a path with or without one or multiple UUID path parameters
 * and one or multiple query parameters.
 *
 * @example
 * // This regex will match all of the following:
 * // 1. "customers/407e42c3-4b3d-4f53-9263-4d5d3a4cd35a"
 * // 2. "customers/407e42c3-4b3d-4f53-9263-4d5d3a4cd35a/"
 * // 3. "/customers/407e42c3-4b3d-4f53-9263-4d5d3a4cd35a?name=X"
 * // 4. "/customers/407e42c3-4b3d-4f53-9263-4d5d3a4cd35a?name=X/"
 * const regex = createLeadingPathRegex("/customers/:id/");
 */
export const createLeadingPathRegex = (path: string): RegExp => {
  path = path.startsWith("/") ? path.substring(1) : path;
  path = path.endsWith("/") ? path.substring(0, path.length - 1) : path;
  return new RegExp(
    `^/${path.replaceAll(
      ":id",
      UUID_PATH_PARAM_REGEX_STRING
    )}${PATH_END_REGEX_STRING}`
  );
};
