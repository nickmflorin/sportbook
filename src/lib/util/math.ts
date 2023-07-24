export function summation(...values: number[]): number;
export function summation(values: number[]): number;
export function summation(...values: number[] | [number[]]): number {
  const _values: number[] = Array.isArray(values[0]) ? values[0] : (values as number[]);
  return _values.reduce((acc, val) => acc + val, 0);
}
