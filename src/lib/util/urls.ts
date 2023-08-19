import { type ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { ReadonlyURLSearchParams } from "next/navigation";
import urlModule, { type UrlObject } from "url";

import { logger } from "~/application/logger";

export type QueryParamValue = string | number | boolean;
export type RawQuery = Record<string, QueryParamValue | undefined | null>;

export function getQueryParams(url: string, options: { asMap: true }): Map<string, string>;
export function getQueryParams(url: string, options?: { asMap?: false }): URLSearchParams;
/**
 * Parses the query parameters from the provided URL and returns the query parameters as an object.
 *
 * @param {string} url The URL that the query parameters should be parsed from.
 *
 * @returns {Record<string, string>}
 * 	 An object that represents the parameter names and values that are in the URL.
 */
export function getQueryParams(url: string, options?: { asMap?: boolean }) {
  const queryString = urlModule.parse(url).query;
  if (options?.asMap === true) {
    const params = new Map<string, QueryParamValue>();
    if (queryString) {
      new URLSearchParams(queryString).forEach((v: string, k: string) => params.set(k, v));
    }
    return params;
  } else if (queryString) {
    return new URLSearchParams(queryString);
  }
  return new URLSearchParams();
}

type _ParamMap = URLSearchParams | ReadonlyURLSearchParams | Record<string, string | null>;

type _Getter<O extends _ParamMap, K extends string> = (obj: O, param: K) => string | null | undefined;

type _ParseParamForm = _ParamMap | string | ReadonlyHeaders;

const isHeaders = (obj: _ParseParamForm): obj is ReadonlyHeaders =>
  typeof obj !== "string" &&
  typeof obj === "object" &&
  obj !== null &&
  typeof (obj as ReadonlyHeaders).get === "function" &&
  !(obj instanceof URLSearchParams) &&
  !(obj instanceof ReadonlyURLSearchParams);

type ParseQueryParamsOptions<K extends string> = {
  readonly params?: K[];
  readonly strict?: boolean;
};

type ParseQueryParamsRT<K extends string, O extends ParseQueryParamsOptions<K>> = O extends { readonly strict: false }
  ? Partial<Record<K, string>>
  : Record<K, string> | null;

const _collect = <M extends _ParamMap, K extends string, O extends ParseQueryParamsOptions<K>>(
  data: M,
  getter: _Getter<M, K>,
  keys: K[],
  options: O,
): ParseQueryParamsRT<K, O> => {
  let parsed: Record<K, string> = {} as Record<K, string>;
  for (const k of keys) {
    const value = getter(data, k);
    if (value !== undefined && value !== null && value.length !== 0) {
      parsed = { ...parsed, [k]: value };
    }
  }
  if (Object.keys(parsed).length === 0) {
    if (options.strict === false) {
      return parsed;
    }
    return null as ParseQueryParamsRT<K, O>;
  } else if (options.strict !== false && Object.keys(parsed).length !== keys.length) {
    /* If the strict option is not set to false, and not all of the query parameters could be parsed, the result should
       be null.  It is an "all or nothing" approach. */
    return null as ParseQueryParamsRT<K, O>;
  }
  return parsed;
};

/**
 * Parses the query parameters associated with the provided parameter names from the provided source, returning either
 * the entire set of valid query parameters (if present) or a potentially partial set of query parameters, depending on
 * the 'strict' flag.
 *
 * The method can parse the query parameters from a variety of sources, including:
 *
 * 1. A {@link string} representation of a URL, path or query string.
 * 2. A {@link URLSearchParams} or {@link ReadonlyURLSearchParams} object.
 * 3. A {@link Record<string, string | null>} object.
 * 4. A {@link ReadonlyHeaders} object.
 *
 * @example
 * // Only return the query parameters if both 'foo' and 'bar' are present, otherwise return null.
 * const params = parseQueryParams(searchParams, { params: ["foo", "bar"] });
 * // params => { foo: string, bar: string } | null
 *
 * @example
 * // Return the present query parameters 'foo' and 'bar' if they are present, returning a partial object if any is not
 * // present or an empty object if both are not present.
 * const params = parseQueryParams(searchParams, { params: ["foo", "bar"], strict: false  });
 * // params => Partial<{ foo: string, bar: string }>
 *
 * @param {string | ReadonlyHeaders |  Record<string, string | null> | ReadonlyURLSearchParams | URLSearchParams} data
 *   The source that the query parameters should be read from.
 * @param {ParseQueryParamsOptions} options
 *   The options that dictate the return type of the method.
 *
 * @returns {ParseQueryParamsRT<K, O>}
 */
export function parseQueryParams<K extends string>(
  data: _ParseParamForm,
  options: ParseQueryParamsOptions<K>,
): ParseQueryParamsRT<K, typeof options> {
  const { strict = true, params } = options;
  if (isHeaders(data)) {
    const encodedQuery = data.get("x-invoke-query");
    if (encodedQuery) {
      const decoded = decodeURIComponent(encodedQuery);
      let parsedJson: Record<string, string>;
      try {
        parsedJson = JSON.parse(decoded);
      } catch (e) {
        logger.error(
          { error: e },
          `Could not parse query string JSON for the 'X-INVOKE-QUERY' header value ${encodedQuery}.`,
        );
        return (strict ? null : {}) as ParseQueryParamsRT<K, typeof options>;
      }
      if (typeof parsedJson === "object" && parsedJson !== null) {
        return parseQueryParams(parsedJson, { params, strict });
      }
      logger.error(`Could not parse query string JSON for the 'X-INVOKE-QUERY' header value ${encodedQuery}.`);
      return (strict ? null : {}) as ParseQueryParamsRT<K, typeof options>;
    }
    return (strict ? null : {}) as ParseQueryParamsRT<K, typeof options>;
  } else if (typeof data === "string") {
    return parseQueryParams(getQueryParams(data), { params, strict });
  } else if (data instanceof URLSearchParams || data instanceof ReadonlyURLSearchParams) {
    // If the specific parameters to parse from the set are not provided, simply parse all of the parameters.
    const k = params === undefined ? ([...data.keys()] as K[]) : params;
    return _collect(data, (o, k) => o.get(k), k, { strict, params });
  }
  // If the specific parameters to parse from the set are not provided, simply parse all of the parameters.
  const k = params === undefined ? ([...Object.keys(data)] as K[]) : params;
  return _collect(data, (o, k) => o[k], k, { strict, params });
}

/**
 * Adds the provided query parameters to the provided URL or path, overwriting existing query parameters that may
 * already exist on the provided URL or path.
 *
 * @template U The type of the URL or path.
 *
 * @param {U} url
 *   The URL or path that the query parameters should be added to.
 *
 * @param {ProcessedQuery} query The query parameters that should be added to the URL or path.
 *
 * @returns {U} The URL or path with the query parameters added.
 */
export const addQueryParamsToUrl = (url: string | UrlObject, query: Partial<RawQuery> | undefined = {}): typeof url => {
  const urlParams = new URLSearchParams();

  // TODO: Should we update existing query parameters?
  Object.keys(query).forEach((k: string) => {
    const v = query[k];
    if (v !== null && v !== undefined && (typeof v !== "string" || v.trim() !== "")) {
      urlParams.append(k, encodeURIComponent(v));
    }
  });
  if (urlParams.toString() !== "") {
    if (typeof url === "string") {
      return url.split("?")[0] + "?" + urlParams.toString();
    }
    /* TODO: We will need to revisit this, as there are other properties of the URL object that might need to be
       specified. */
    return {
      ...url,
      query: urlParams.toString(),
    };
  }
  return url;
};
