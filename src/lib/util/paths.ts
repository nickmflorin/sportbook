import { z } from "zod";

export const UUID_PATH_PARAM_REGEX_STRING = "([0-9a-zA-z-]+)";
export const PATH_END_REGEX_STRING = "(?:\\/)?(\\?([^\\/]+)?(\\/)?)?$";

export const isUuid = (value: unknown): value is string => z.string().uuid().safeParse(value).success;

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
  return new RegExp(`^/${path.replaceAll(":id", UUID_PATH_PARAM_REGEX_STRING)}${PATH_END_REGEX_STRING}`);
};

/* RegExp is not a serializable value so it cannot be passed from Server Components to Client Components.  To alleviate
   this issue, we incorporate the { leadingPath: string } type, which will prompt a RegExp to be created on the client
   with the 'leadingPath' string. */
type _PathActive = RegExp | boolean | ((pathname: string) => boolean) | { leadingPath: string };

export type PathActive = _PathActive | _PathActive[];

export const pathIsActive = (path: PathActive, pathname: string): boolean => {
  if (!Array.isArray(path)) {
    if (path instanceof RegExp) {
      return path.test(pathname);
    } else if (typeof path === "boolean") {
      return path;
    } else if (typeof path === "function") {
      return path(pathname);
    }
    const regex = createLeadingPathRegex(path.leadingPath);
    return pathIsActive(regex, pathname);
  }
  return path.map(p => pathIsActive(p, pathname)).includes(true);
};
