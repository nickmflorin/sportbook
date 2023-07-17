import isEqual from "lodash.isequal";
import keys from "lodash.keys";
import pickBy from "lodash.pickby";

// A type that is meant to represent a valid element of an array that is not an Array itself.
export type ArrayPrimitive = null | boolean | number | string | Record<string, unknown>;

export type ArrayCount<T extends ArrayPrimitive> = { value: T; count: number };

/**
 * Counts the frequency of elements in an array, {@link T[]}, and returns an array of elements, {@link ArrayCount<T>[]},
 * where each element includes the value in the original array, {@link T}, along with its frequency.
 *
 * The implementation intentionally returns an array, {@link ArrayCount<T>}, rather than an object keyed by the values
 * and valued by their associated frequency, in order to preserve the ordering of the values in the array and avoid
 * cases where an array of numbers results in an object with string keys.
 *
 * @param {T[]} arr The array of elements for which the frequencies should be returned.
 *
 * @returns {ArrayCount<T>[]}
 */
export const countInArray = <T extends ArrayPrimitive>(arr: T[], compare?: (a: T, b: T) => boolean): ArrayCount<T>[] =>
  arr.reduce((prev: ArrayCount<T>[], curr: T): ArrayCount<T>[] => {
    const indices = keys(
      pickBy(prev, (c: ArrayCount<T>) =>
        compare !== undefined ? compare(c.value, curr) === true : isEqual(c.value, curr),
      ),
    );
    if (indices.length >= 1) {
      throw new Error(`Unexpected Condition: Multiple indices found for value ${JSON.stringify(curr)}.`);
    }
    const ind = indices[0] === undefined ? undefined : parseInt(indices[0]);
    const prevCount = ind === undefined ? undefined : prev[ind];
    if (ind === undefined) {
      return [...prev, { count: 1, value: curr }];
    }
    prev[ind] = { ...prevCount, value: curr, count: (prevCount?.count || 0) + 1 };
    return prev;
  }, []);

/**
 * Returns an array of elements, {@link T[]}, that were present in the provided array, {@link T[]}, more than 1 time.
 *
 * @param {T[]} arr The array of elements for which the duplicates should be returned.
 *
 * @returns {T[]}
 */
export const findDuplicates = <T extends ArrayPrimitive>(arr: T[], compare?: (a: T, b: T) => boolean): T[] => {
  const count = countInArray(arr, compare);
  return count.filter((c: ArrayCount<T>) => c.count > 1).map((c: ArrayCount<T>) => c.value);
};

/**
 * Replaces the provided 'value' in the array, {@link T[]}, if the 'value' exists in the array.  Returns the potentially
 * updated array with an indication of whether or not the value was replaced.
 *
 * @template {T} Element The type of the elements inside of the array.
 *
 * @param {T[]} arr The array for which the value should be appended to or replaced in.
 *
 * @param {T | ((v: P) => T)} value
 *   The value that should be inserted into the array in place of a potentially existing value.  If the value being
 *   inserted into the array {@link T[]}, depends on the potentially existing value in the array, {@link T}, this
 *    parameter can be provided as a callback.
 *
 * @param {(v: T) => boolean} predicate Indicates whether or not the value exists in the array.
 *
 * @returns {T[]}
 */
export const replaceInArray = <T extends Record<string, unknown> | string | number, P extends T>(
  arr: T[],
  value: T | ((v: P) => T),
  predicate: ((v: T) => v is P) | ((v: T) => boolean),
): [boolean, T[]] => {
  const ind = arr.findIndex((v: T) => predicate(v) === true);
  if (ind !== -1) {
    const currentV = arr[ind] as P;
    return [true, [...arr.slice(0, ind), typeof value === "function" ? value(currentV) : value, ...arr.slice(ind + 1)]];
  }
  return [false, arr];
};
