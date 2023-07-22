import { DateTime } from "luxon";

import { ensuresDefinedValue } from "~/lib/util";

const evaluateFrequency = (frequency = 0): boolean => {
  if (frequency > 1.0 || frequency < 0) {
    throw new TypeError("The frequency must be between 0 and 1.");
  }
  return randomInt({ min: 0, max: 100 }) / 100.0 < frequency;
};

export const randomlyNull =
  <T>(func: () => T, nullChance: number): (() => T | null) =>
  (): T | null =>
    evaluateFrequency(nullChance) ? null : func();

type MinMax = {
  min: number;
  max: number;
};

export type RandomInterval = MinMax | [number, number];
export type RandomLength = RandomInterval | number;

const lengthIsInterval = (l: RandomLength): l is RandomInterval => typeof l !== "number";

export const getLength = (l: RandomLength): number => (lengthIsInterval(l) ? randomInt(l) : l);

export const getRequiredLength = (l: RandomLength): number =>
  lengthIsInterval(l) ? (Array.isArray(l) ? l[0] : l.min) : l;

export const mapOverLength = <T>(l: RandomLength, func: (i: number) => T): T[] =>
  Array(getLength(l))
    .fill(0)
    .map((_, i) => func(i));

export function randomInt(min: number, max: number): number;
export function randomInt(params: RandomInterval): number;
export function randomInt(min: number | RandomInterval, max?: number) {
  if (typeof min === "number") {
    if (typeof max !== "number") {
      throw new TypeError("The max value was either not provided or is not valid.");
    }
    return randomInt({ max, min });
  } else if (Array.isArray(min)) {
    return randomInt({ min: min[0], max: min[1] });
  }
  return Math.floor(Math.random() * (Math.floor(min.max) - Math.ceil(min.min) + 1) + Math.ceil(min.min));
}

type GenerateRandomDateParams = { min?: Date | DateTime; max?: Date | DateTime; nullFrequency?: number };

const _toDateTime = (value: Date | DateTime) => (value instanceof Date ? DateTime.fromJSDate(value) : value);

type GenerateRandomDateRT<P extends GenerateRandomDateParams> = P extends { nullFrequency: number }
  ? Date | null
  : Date;

export const generateRandomDate = <P extends GenerateRandomDateParams>(params?: P): GenerateRandomDateRT<P> => {
  if (params?.nullFrequency !== undefined && evaluateFrequency(params?.nullFrequency)) {
    return null as GenerateRandomDateRT<P>;
  }
  const max: DateTime = params?.max === undefined ? DateTime.now() : _toDateTime(params.max);
  const min: DateTime = params?.min === undefined ? max.minus({ months: 36 }) : _toDateTime(params.min);
  if (max <= min) {
    throw new TypeError("The max date must be after the min date.");
  }
  const diff = max.diff(min, ["seconds"]).seconds * (randomInt({ min: 0, max: 100 }) / 100.0);
  return min.plus({ seconds: Math.floor(diff) }).toJSDate();
};

export const selectAtRandom = <T>(data: T[]): T => {
  if (data.length === 0) {
    throw new Error("No data exists at the first index because the provided data is empty.");
  }
  const ind = randomInt(0, data.length - 1);
  const datum = data[ind];
  if (datum === undefined) {
    throw new Error(`Data unexpectedly returned undefined value at index ${ind}!`);
  }
  return datum;
};

type FrequencyDatum<T> = { value: T; frequency: number };

export const selectAtRandomFrequency = <T>(data: FrequencyDatum<T>[]): T => {
  const total = data.reduce((prev, { frequency }) => (prev += frequency), 0.0);
  const normalized = data.map(d => ({ ...d, frequency: d.frequency / total }));
  const control = randomInt({ min: 0, max: 100 }) / 100.0;

  let result = data[0];
  if (result === undefined) {
    throw new Error("No data exists at the first index because the provided data is empty.");
  }
  for (let i = 1; i < data.length; i++) {
    const previous = ensuresDefinedValue(normalized[i - 1]);
    const current = ensuresDefinedValue(normalized[i]);
    if (previous.frequency < control && control < current.frequency) {
      result = data[i];
      break;
    }
  }
  if (!result) {
    throw new Error(`Unexpected Condition: No result was found for frequency ${control}!`);
  }
  return result?.value;
};

const isDuplicated = <T, V extends string | number>(prev: T[], value: T, duplicationKey: (v: T) => V): boolean =>
  prev.some(p => duplicationKey(value) === duplicationKey(p));

export const selectAtRandomWithoutDuplication = <T, V extends string | number>(
  data: T[],
  prev: T[],
  duplicationKey: (v: T) => V,
): T | null => {
  let population = [...data];

  while (population.length > 0) {
    const ind = randomInt(0, population.length - 1);
    const datum = population[ind];
    if (!datum) {
      throw new Error(`Data unexpectedly returned undefined value at index ${ind}!`);
    } else if (isDuplicated(prev, datum, duplicationKey)) {
      // If the selected value is a duplicate, simply remove that value from the selection population and try again.
      population = [...population.slice(0, ind), ...population.slice(ind + 1)];
    } else {
      return datum;
    }
  }
  return null;
};

type RandomSelectionArrayOpts<T, V extends string | number> = {
  /**
   * Either the length that the randomly selected array should be or a minimum, maximum length range that the resulting
   * array should lie in.  The returned array will meet this length criteria as long as there are sufficient elements in
   * the array to select from.
   */
  length: RandomLength;
  /**
   * If provided, elements will be randomly selected and added to the array as long as they do not represent duplicates
   * of elements already in the array, where a duplicate is determined based on an equality check of this function's
   * return value.
   *
   * Elements will continue to be selected until the array reaches the desired length or until there are no more
   * elements to select that ensure uniqueness in the array.
   */
  duplicationKey?: (v: T) => V;
  /**
   * Whether or not an error should be thrown when there are no more unique elements to select from and making a
   * selection from the array would require introducing a duplicate value.  If not provided, or provided as 'false',
   * the array will be prematurely returned with the elements that were selected up to that point, ensuring that there
   * are no duplicates but also not generating an array that meets the length requirement.
   *
   * Only applicable when 'duplicationKey' is provided.
   */
  throwWhenNoUniqueElements?: boolean;
};

/**
 * Creates an array of randomly selected elements, {@link T[]}, by making random selections from the provided array,
 * {@link T[]}, either until the maximum length is reached or until there are no more unique elements to select from
 * (in the case that the `duplicationKey` is provided).
 *
 * Options: @see {RandomSelectionArrayOpts}
 *
 * @template T The type of the elements in the array.
 *
 * @param {T[]} data The array to select from.
 * @param {RandomSelectionArrayOpts<T>} options Options that define the random selection.
 * @returns {T[]} A new array formed from random selections from the provided array.
 *
 * @example
 * const data = [1, 2, 3, 4, 5];
 * randomSelectionArray(data, { length: 3 }); // [1, 3, 5]
 */
export const selectArrayAtRandom = <T, V extends string | number>(
  data: T[],
  options: RandomSelectionArrayOpts<T, V>,
): T[] => {
  let arr: T[] = [];
  for (let i = 0; i < getLength(options.length); i++) {
    if (options.duplicationKey) {
      // If the selection is null, it means that there are no more unique elements to select from.
      const selection = selectAtRandomWithoutDuplication(data, arr, options.duplicationKey);
      if (!selection) {
        /* Since the length of the array may have been randomly generated, we only want to throw an error in the case
           that no more unique elements can be constructed AND the number of already selected unique elements does not
           meet the minimum threshold.  If the length is provided as just a single number (i.e. no min/max or range)
           the required length will be equal to that length. */
        const requiredLength = getRequiredLength(options.length);
        if (arr.length < requiredLength && options.throwWhenNoUniqueElements) {
          throw new Error(
            `The minimum length of the randomly generated array is '${requiredLength}', but after selecting ` +
              `'${arr.length}' unique elements, no more unique elements remained in the array.  Either the minimum ` +
              "length of the array should be less, or the provided array should be longer.",
          );
        }
        return arr;
      }
      arr = [...arr, selection];
    } else {
      arr = [...arr, selectAtRandom(data)];
    }
  }
  return arr;
};

export const selectSequentially = <T>(data: T[], count = 0): T => {
  if (data.length === 0) {
    throw new Error("No data exists at the first index because the provided data is empty.");
  } else if (count >= data.length) {
    const datum = data[count % data.length];
    if (datum === undefined) {
      throw new Error(
        `Data unexpectedly does not have value at index '${
          count % data.length
        }', original index was '${count}' and data length was '${data.length}'.`,
      );
    }
    return datum;
  }
  const datum = data[count];
  if (datum === undefined) {
    throw new Error(`Data unexpectedly does not have value at index '${count}', data length was '${data.length}'.`);
  }
  return datum;
};

export function infiniteLoop<T>(data: T[], step = 1): () => T {
  let cur = -1;
  const len = data.length;

  return (): T => {
    cur += step;
    cur = cur >= len ? 0 : cur;
    if (data[cur] === undefined) {
      throw new Error("No data exists at the first index because the provided data is empty.");
    }
    return data[cur] as T;
  };
}

export function* infiniteLoopGenerator<T, V extends string | number>(
  getter: () => T,
  options: RandomSelectionArrayOpts<T, V>,
): Generator<T> {
  let seen: T[] = [];

  for (let i = 0; i < getLength(options.length); i++) {
    const value = getter();
    /* If there is a duplication key, keep iterating until a duplicate is found - at that point in time, we will have
       gone through the entire iterable (assuming there are no duplicates in the iterable). */
    const duplicationKey = options.duplicationKey;
    if (duplicationKey && isDuplicated(seen, value, duplicationKey)) {
      break;
    }
    seen = [...seen, value];
    yield value;
  }
}

export const infiniteLoopSelection = <T, V extends string | number>(
  getter: () => T,
  options: RandomSelectionArrayOpts<T, V>,
): T[] => {
  const gen = infiniteLoopGenerator(getter, options);
  return [...gen];
};
