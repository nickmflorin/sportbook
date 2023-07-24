export function summation(...values: number[]): number;
export function summation(values: number[]): number;
export function summation(...values: number[] | [number[]]): number {
  const _values: number[] = Array.isArray(values[0]) ? values[0] : (values as number[]);
  return _values.reduce((acc, val) => acc + val, 0);
}

export const permutations = <T>(arr: T[]): T[][] => {
  if (arr.length <= 2) {
    const _arr = arr as [T, T] | [T];
    return _arr.length === 2 ? [_arr, [_arr.at(1), _arr.at(0)] as [T, T]] : [_arr];
  }
  return arr.reduce(
    (acc: T[][], item, i) =>
      acc.concat(permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [item, ...val])),
    [],
  );
};

const _getOtherIndices = (index: number, length: number): number[] => {
  if (index >= length) {
    throw new Error(`Cannot generate other indices for index '${index}' in array of length '${length}'.`);
  }
  return Array(length)
    .fill(0)
    .map((_, i) => i)
    .filter(i => i !== index);
};

export const permutationsAtCount = <T>(arr: T[], count: number): T[][] => {
  if (arr.length < count) {
    throw new Error("Cannot generate permutations of a count greater than the length of the array.");
  }
  if (count === 1) {
    return arr.map(val => [val]);
  }
  let perms: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    // Determine what other values are in the array besides the value that is at the current iteration index.
    const otherVals = _getOtherIndices(i, arr.length).map((ind): T => {
      if (arr[ind] === undefined) {
        throw new Error(`Unexpected Condition: Encountered undefined value at index '${ind}.'`);
      }
      return arr[ind] as T;
    });
    /* Using the value at the current iteration index as the first element, generate all permutations of the other
       elements in the array.

       arr = ["A", "B", "C", "D"];
       i = 1;
       count = 3;
       otherVals = ["A", "C", "D"];
       permutationsAtCount(otherVals, count - 1) = [["A", "C"], ["A", "D"], ["C", "A"], ["C", "D"], ["D", "A"], ...];
       perms = [...perms, ["B", "A", "C"], ["B", "A", "D"], ["B", "C", "A"], ["B", "C", "D"], ["B", "D", "A"], ...
       */
    perms = [...perms, ...permutationsAtCount(otherVals as T[], count - 1).map((perm): T[] => [arr[i] as T, ...perm])];
  }
  return perms;
};
