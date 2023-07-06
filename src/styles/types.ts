import { z } from "zod";

import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/utils/literals";

type _ColorShade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type ColorShade = _ColorShade | `${_ColorShade}`;

const ColorShadeSchema = z.coerce.number().int().min(1).max(10);

export const isColorShade = (v: string | number): v is ColorShade => {
  const parsed = ColorShadeSchema.safeParse(v);
  if (parsed.success) {
    return true;
  }
  return false;
};

type ColorShadeAssertion = (v: string | number) => asserts v is ColorShade;

export const assertColorShade: ColorShadeAssertion = v => {
  if (!isColorShade(v)) {
    throw new Error(`The value ${v} is not a valid shade!`);
  }
};

export const ColorNames = enumeratedLiterals([
  "blue",
  "green",
  "red",
  "yellow",
  "success",
  "error",
  "warning",
  "neutral",
  "body",
  "heading",
  "orange",
  "gray",
] as const);

export type ColorName = EnumeratedLiteralType<typeof ColorNames>;

export type Color = ColorName | `${ColorName}.${ColorShade}`;

export type ColorForm = "background-color" | "color" | "background" | "border-color";
