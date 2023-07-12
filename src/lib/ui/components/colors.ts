import { z } from "zod";

import { type EnumeratedLiteralType, enumeratedLiterals } from "~/lib/util/literals";

type _ColorShade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type ColorShade = _ColorShade | `${_ColorShade}`;

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
  "white",
  "black",
] as const);

export type ColorName = EnumeratedLiteralType<typeof ColorNames>;

export type Color = ColorName | `${ColorName}.${ColorShade}`;

export const ColorPropNames = ["backgroundColor", "color", "borderColor"] as const;
export type ColorPropName = (typeof ColorPropNames)[number];

type ColorNativePropName = "background-color" | "color" | "border-color";

export const ColorPropNameMap: { [key in ColorPropName]: ColorNativePropName } = {
  backgroundColor: "background-color",
  borderColor: "border-color",
  color: "color",
};

export interface ColorClassNameParams {
  readonly color?: Color | null;
  readonly shade?: ColorShade;
}

export const parseColor = (color: Color): [ColorName, ColorShade | null] => {
  if (color.includes(".")) {
    const name = ColorNames.validate(color.split(".")[0]);
    const shade = color.split(".")[1];
    if (!shade) {
      throw new Error(`The provided color '${color}' is invalid!`);
    }
    assertColorShade(shade);
    return [name, shade];
  }
  const name = ColorNames.validate(color);
  return [name, null];
};

export const getColorClassName = (prop: ColorPropName, { color, shade }: ColorClassNameParams): string => {
  if (color) {
    const [name, sh] = parseColor(color);
    if (shade) {
      // The provided shade should override the shade in the color string.
      return `${ColorPropNameMap[prop]}-${name}-${shade}`;
    } else if (sh) {
      return `${ColorPropNameMap[prop]}-${name}-${sh}`;
    }
    return `${ColorPropNameMap[prop]}-${name}`;
  }
  return "";
};
