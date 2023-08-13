import urlModule, { type UrlObject } from "url";

export type QueryParamValue = string | number | boolean;
export type RawQuery = Record<string, QueryParamValue | undefined | null>;

/**
 * Parses the query parameters from the provided URL and returns the query parameters as an object.
 *
 * @param {string} url The URL that the query parameters should be parsed from.
 *
 * @returns {Record<string, string>}
 * 	 An object that represents the parameter names and values that are in the URL.
 */
export const getQueryParams = (url: string): Map<string, QueryParamValue> => {
  const queryString = urlModule.parse(url).query;
  const params = new Map<string, QueryParamValue>();
  if (queryString) {
    new URLSearchParams(queryString).forEach((v: string, k: string) => params.set(k, v));
  }
  return params;
};

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
