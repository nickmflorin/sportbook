import { type ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { ReadonlyURLSearchParams } from "next/navigation";
import urlModule, { type UrlObject } from "url";

import { logger } from "~/application/logger";

export type QueryParamValue = string | number | boolean | null | undefined;
export type RawQuery = Record<string, QueryParamValue>;

type QueryParamOptions = {
  readonly asMap?: boolean;
};

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
export function getQueryParams(url: string, options?: QueryParamOptions) {
  const queryString = urlModule.parse(url).query;
  if (options?.asMap === true) {
    const params = new Map<string, string>();
    if (queryString) {
      new URLSearchParams(queryString).forEach((v: string, k: string) => params.set(k, v));
    }
    return params;
  } else if (queryString) {
    return new URLSearchParams(queryString);
  }
  return new URLSearchParams();
}

const isReadOnlyParams = (params: ReadonlyURLSearchParams | URLSearchParams): params is ReadonlyURLSearchParams =>
  typeof (params as URLSearchParams).set === "undefined";

const searchParamsToMap = (params: ReadonlyURLSearchParams | URLSearchParams): Map<string, string> => {
  const paramMap = new Map<string, string>();
  for (const [k, v] of params.entries()) {
    paramMap.set(k, v);
  }
  return paramMap;
};

const isNullableSearchParamValue = (v: string | boolean | number | null | undefined): v is string | null =>
  v === null || (typeof v === "string" && v.length === 0);

export function updateQueryParams(
  params: ReadonlyURLSearchParams | URLSearchParams,
  updates: Record<string, string | boolean | number | null | undefined>,
  options: { asMap: true },
): Map<string, string>;
export function updateQueryParams<V extends ReadonlyURLSearchParams | URLSearchParams>(
  params: V,
  updates: Record<string, string | boolean | number | null | undefined>,
  options?: { asMap?: false },
): V;
/**
 * Updates the query parameters, {@link URLSearchParams} or {@link ReadonlyURLSearchParams}, with the provided new set
 * of parameters, defined by {@link Record<string, string>}.
 *
 * @param {URLSearchParams | ReadonlyURLSearchParams} params
 *   The original query parameters object that should be updated.
 *
 * @param {RawQuery} updates
 *   The updates that should be applied to the original set of provided parameters.  Undefined values will be ignored
 *   whereas null values will cause the query parameter to be removed from the original parameters if present.
 *
 * @returns {Map<string, string> | ReadonlyURLSearchParams | URLSearchParams}
 * 	 An object that represents the original query parameters with the updates applied.
 */
export function updateQueryParams(
  params: URLSearchParams | ReadonlyURLSearchParams,
  updates: RawQuery,
  options?: QueryParamOptions,
): Map<string, string> | ReadonlyURLSearchParams | URLSearchParams {
  const newSearchParams = new URLSearchParams();

  /* First, add all of the existing query parameters to the set as long as they are not in the set of new parameters. */
  for (const param in params) {
    // If the existing parameter is not in the new set of provided parameters, leave it in the set of parameters.
    if (updates[param] === undefined) {
      const currentValue = params.get(param);
      if (currentValue !== null) {
        newSearchParams.set(param, currentValue);
      }
    }
  }
  /* Loop over the keys of the params so that we can tell the difference between a parameter that is included with an
     explicitly undefined value and a parameter that is not included at all. */
  for (const param in updates) {
    const value = updates[param];
    if (value !== undefined) {
      if (isNullableSearchParamValue(value) && newSearchParams.has(param)) {
        newSearchParams.delete(param);
      } else if (!isNullableSearchParamValue(value)) {
        newSearchParams.set(param, encodeURIComponent(value));
      }
    }
  }
  if (options?.asMap === true) {
    return searchParamsToMap(newSearchParams);
  } else if (isReadOnlyParams(params)) {
    return new ReadonlyURLSearchParams(newSearchParams);
  } else {
    return newSearchParams;
  }
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

type AddQueryParamsToUrlOptions = {
  readonly replaceAll: boolean;
};

const arg1IsBase = (
  arg1: RawQuery | URLSearchParams | ReadonlyURLSearchParams,
): arg1 is URLSearchParams | ReadonlyURLSearchParams =>
  typeof (arg1 as URLSearchParams | ReadonlyURLSearchParams).get === "function";

const arg2IsOptions = (
  arg2: RawQuery | AddQueryParamsToUrlOptions | undefined,
): arg2 is AddQueryParamsToUrlOptions | undefined =>
  typeof arg2 === "undefined" || typeof (arg2 as AddQueryParamsToUrlOptions).replaceAll === "boolean";

export function addQueryParamsToUrl(
  url: string | UrlObject,
  query: RawQuery,
  options?: AddQueryParamsToUrlOptions | undefined,
): typeof url;

export function addQueryParamsToUrl(
  url: string,
  baseQuery: URLSearchParams | ReadonlyURLSearchParams,
  newQuery: RawQuery,
): typeof url;

/**
 * Adds the provided query parameters to the provided URL or path, overwriting existing query parameters that may
 * already exist on the provided URL or path.
 *
 * @example
 * // Returns "/leagues/5/teams?foo=apple&bar=bat&bat=banana"
 * const url = "/leagues/5/teams"
 * const existingSearch = new SearchParams("foo=bar&bat=banana")
 * addQueryParamsToUrl(url, existingSearch, { foo: "apple", bar: "bat" })
 *
 * @example
 * // Returns "/leagues/5/teams?foo=apple&bar=bat&bat=banana"
 * const url = "/leagues/5/teams?foo=bar&bat=banana"
 * addQueryParamsToUrl(url, { foo: "apple", bar: "bat" })
 *
 * @param {string | UrlObject} url
 *   The URL {@link string} or object, {@link UrlObject}, that the query parameters should be added to.
 *
 * @param {RawQuery | URLSearchParams | ReadonlyURLSearchParams} queryArg1
 *   Either the query parameters that should be added to the provided url as record type {@link RawQuery}, or the
 *   existing set of query parameters that should be updated with the second argument before being applied to the
 *   provided url, provided as {@link URLSearchParams | ReadonlyURLSearchParams}.
 *
 * @param {RawQuery | AddQueryParamsToUrlOptions} queryArg2
 *   Either the query parameters that should be used to update the URL - if 'queryArg1' is provided as the original set
 *   of query parameters, or the options for the function - if 'queryArg1' is provided as the query parameters to
 *   update.
 *
 * @returns {U}
 *   The URL {@link string} or object, {@link UrlObject} (depending on the type of the first argument) with the query
 *   parameters added.
 */
export function addQueryParamsToUrl(
  url: string | UrlObject,
  queryArg1: RawQuery | URLSearchParams | ReadonlyURLSearchParams,
  queryArg2?: RawQuery | AddQueryParamsToUrlOptions | undefined,
): typeof url {
  const u = typeof url === "string" ? url : url.search || "";
  const options: AddQueryParamsToUrlOptions = arg2IsOptions(queryArg2)
    ? queryArg2 || { replaceAll: false }
    : { replaceAll: false };

  let updatedParams: URLSearchParams | ReadonlyURLSearchParams;
  if (arg1IsBase(queryArg1)) {
    if (arg2IsOptions(queryArg2)) {
      throw new Error("Improper Function Usage: The second argument must be a record-type of query param updates.");
    }
    updatedParams = updateQueryParams(queryArg1, queryArg2);
  } else {
    const urlParams = options.replaceAll !== true ? getQueryParams(u) : getQueryParams("");
    updatedParams = updateQueryParams(urlParams, queryArg1);
  }

  if (updatedParams.toString() !== "") {
    if (typeof url === "string") {
      return url.split("?")[0] + "?" + updatedParams.toString();
    }
    /* TODO: We will need to revisit this, as there are other properties of the URL object that might need to be
       specified. */
    return {
      ...url,
      query: updatedParams.toString(),
      search: updatedParams.toString(), // I do not think this is right!
    };
  }
  return url;
}
