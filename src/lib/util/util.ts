import { type Subtract } from "utility-types";

/**
 * Returns a new object, {@link Omit<T, K>}, that consists of the key-value pairs of the original object, {@link T},
 * with the provided keys, {@link K}, removed.
 *
 * @param {T} obj The object for which the attributes should be removed.
 * @param {K} attrs The attributes of the original object that should be removed.
 * @returns {Omit<T, K>} A mutated object with the keys of the original object removed.
 */
export const removeObjAttributes = <T extends Partial<Record<K, unknown>>, K extends string = string>(
  obj: T,
  attrs: K[],
): Omit<T, K> =>
  Object.keys(obj).reduce(
    (prev: Omit<T, K>, curr: string) => (attrs.includes(curr as K) ? prev : { ...prev, [curr]: obj[curr as K] }),
    {} as Omit<T, K>,
  );

/**
 * Returns a two new objects: (1) a new object constructed from the provided attributes and their associated values on
 * the original object, and (2) a new object constructed from the leftover attributes on the original object after the
 * provided attributes were removed.
 *
 * Usage
 * -----
 * // Returns [{ apple: "fruit" }, { foo: "bar" }]
 * splitObjAttributes({foo: "bar", apple: "fruit"}, ["apple"])
 *
 * @param {T} obj The object for which the attributes should be split.
 * @param {K} attrs
 *   The attributes of the original object that should be removed from the object and inserted into a new object,
 *   {@link Omit<T, Exclude<keyof T, K>>}.
 * @returns {[K, Subtract<T, K>]}
 */
export const pluckObjAttributes = <
  T extends K,
  K extends { [key in N]: T[key] },
  N extends keyof T = keyof Subtract<T, K>,
>(
  obj: T,
  attrs: N[],
): [K, Subtract<T, K>] =>
  Object.keys(obj).reduce(
    (prev: [K, Subtract<T, K>], curr: string): [K, Subtract<T, K>] =>
      attrs.includes(curr as N)
        ? ([{ ...prev[0], [curr]: obj[curr as N] }, prev[1]] as [K, Subtract<T, K>])
        : ([prev[0], { ...prev[1], [curr]: obj[curr as N] }] as [K, Subtract<T, K>]),
    [{}, {}] as [K, Subtract<T, K>],
  );
