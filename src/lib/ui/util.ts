import classNames from "classnames";

import { replaceInArray } from "../util/arrays";

import { type ClassName } from "./props";

type ClassNameReplacement = {
  readonly predicate: string | ((v: string) => boolean);
  readonly insert: string | null | undefined;
};

type ReplaceClassNameParams = ClassNameReplacement & {
  readonly current: ClassName;
};

export const replaceClassName = ({ current, predicate, insert }: ReplaceClassNameParams): string => {
  if (insert === null || insert === undefined) {
    return classNames(current);
  }
  const parsed = classNames(current)
    .split(" ")
    .map(c => c.trim());
  const [_, updated] = replaceInArray(
    parsed,
    insert,
    typeof predicate === "function" ? predicate : (v: string) => v === predicate,
  );
  return classNames(updated);
};

export const replaceOrAddClassName = ({ current, predicate, insert }: ReplaceClassNameParams): string => {
  if (insert === null || insert === undefined) {
    return classNames(current);
  }
  const parsed = classNames(current)
    .split(" ")
    .map(c => c.trim());
  const [replaced, updated] = replaceInArray(
    parsed,
    insert,
    typeof predicate === "function" ? predicate : (v: string) => v === predicate,
  );
  if (!replaced) {
    return classNames([...parsed, insert]);
  }
  return classNames(updated);
};

export const replaceOrAddClassNames = (current: string, ...args: ClassNameReplacement[]): string =>
  args.reduce((prev: string, arg: ClassNameReplacement) => replaceOrAddClassName({ current: prev, ...arg }), current);
