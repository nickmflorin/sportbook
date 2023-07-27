import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

import { logger } from "~/application/logger";

import { ensuresDefinedValue } from "./typeguards";

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
type MultipleFrequencyDatum<T> = { value: T; frequency: number; maxCount?: number };
type MultipleFrequencyDatumWithId<T> = { id: string; value: T; frequency: number; maxCount?: number };

type SelectMultipleAtRandomFrequencyOptions = {
  readonly length: RandomLength;
};

export function selectAtRandomFrequency<T>(data: FrequencyDatum<T>[]): T;
export function selectAtRandomFrequency<T>(
  data: MultipleFrequencyDatum<T>[],
  options: SelectMultipleAtRandomFrequencyOptions,
): T[];

/**
 * Makes selections at random with the provided frequencies, returning either an array of multiple selections (if the
 * 'length' option is provided) or a single selection (if the 'length' option is not provided).
 *
 * @param {FrequencyDatum<T>[] | MultipleFrequencyDatum<T>[]} data
 *   The data that defines both the values to select from and the frequencies at which those values should be selected.
 *
 * @param {SelectMultipleAtRandomFrequencyOptions} options
 *   If multiple selections are desired, the options that include the 'length' of the resulting array.
 *
 * @returns {T | T[]}
 *
 * @example
 * type Fruit = "Apple" | "Banana" | "Strawberry";
 * const data: Fruit[] = selectAtRandomFrequency([
 *   { value: "Apple", frequency: 0.5 },
 *   { value: "Banana": frequency: 0.1, maxCount: 2 },
 *   { value: "Strawberry", frequency: 0.4 }
 * ], { length: { min: 10, max: 30 }})
 *
 * Note that the frequencies do not need to sum to 1, they will be normalized relative to each other.
 */
export function selectAtRandomFrequency<T>(
  data: FrequencyDatum<T>[] | MultipleFrequencyDatum<T>[],
  options?: SelectMultipleAtRandomFrequencyOptions,
) {
  const _selectAtRandomFrequency = <F extends FrequencyDatum<T>>(frequencies: F[]) => {
    if (frequencies.length === 0) {
      throw new Error("A selection cannot be made because no data was provided.");
    } else if (frequencies.filter(d => d.frequency < 0).length > 0) {
      throw new Error(
        `Detected negative numbers in frequency data: ${JSON.stringify(frequencies)}.  Frequencies must be >= 0.`,
      );
    }
    const total = frequencies.reduce((prev, { frequency }) => (prev += frequency), 0.0);
    const normalized = frequencies.map(d => ({ ...d, frequency: d.frequency / total }));
    const accumulated = normalized
      .slice(1)
      .reduce(
        (acc: number[], freq: FrequencyDatum<T>): number[] => [
          ...acc,
          ensuresDefinedValue(acc[acc.length - 1]) + freq.frequency,
        ],
        [ensuresDefinedValue(normalized[0]).frequency],
      );
    const cumulative = normalized.map((d, i) => ({ ...d, cumulativeFrequency: ensuresDefinedValue(accumulated[i]) }));
    const control = randomInt({ min: 0, max: 100 }) / 100.0;

    for (let i = 0; i < cumulative.length; i++) {
      const current = ensuresDefinedValue(cumulative[i]);
      // It is important that the comparison include an equality for cases where the control is exactly 1.0.
      if (control <= current.cumulativeFrequency) {
        return current;
      }
    }
    throw new Error(
      `Unexpected Condition: No result was found for frequency value = '${control}'.  Population data ` +
        `was: \n${JSON.stringify(frequencies)}\nThe cumulative, normalized frequencies are:\n${JSON.stringify(
          cumulative,
        )}`,
    );
  };

  if (options) {
    /* In the case that multiple selections are being made, we need to be able to differentiate a given datum from
       another one, which allows us to determine if the maximum selection count for a given datum has been reached.  We
       cannot identify a datum based on the value, because the value may not be comparable with a shallow equality and
       it is possible that multiple datums exist with the same value.  So, each datum needs to be assigned a unique ID
       at the start - which will allow us to remove datums from the frequency population in the case that its max count
       was reached. */
    let runningFrequencies: MultipleFrequencyDatumWithId<T>[] = [...data].map(d => ({ ...d, id: uuid() }));
    let result: T[] = [];
    const desiredLength = getLength(options.length);

    while (result.length < desiredLength && runningFrequencies.length !== 0) {
      const datum = _selectAtRandomFrequency(runningFrequencies);
      const currentCount = result.filter(d => d === datum.value).length;
      if (datum.maxCount !== undefined) {
        if (currentCount > datum.maxCount) {
          throw new Error("");
        } else if (currentCount === datum.maxCount) {
          runningFrequencies = runningFrequencies.filter(d => d.id !== datum.id);
        } else {
          result = [...result, datum.value];
        }
      }
    }
    if (result.length < desiredLength) {
      logger.warn(
        `Could not select the desired number of elements, '${desiredLength}', from the provided data.  The maximum ` +
          "counts of each value in the dataset were reached before the desired length was met.",
      );
    }
    return result;
  }
  // No length was provided, only make a single selection.
  return _selectAtRandomFrequency(data).value;
}

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
