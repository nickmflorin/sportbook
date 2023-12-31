import classNames from "classnames";
import { z } from "zod";

import { type EnumeratedLiteralType, enumeratedLiterals } from "~/lib/util/literals";

type _ColorShade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

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

type _Color = ColorName | `${ColorName}.${ColorShade}`;

export type Color = _Color | [_Color, ColorShade | null] | { color: _Color; shade?: ColorShade | null };

export const ColorPropNames = ["backgroundColor", "color", "borderColor", "outlineColor"] as const;
export type ColorPropName = (typeof ColorPropNames)[number];

type ColorNativePropName = "background-color" | "color" | "border-color" | "outline-color";

export const ColorPropNameMap: { [key in ColorPropName]: ColorNativePropName } = {
  backgroundColor: "background-color",
  borderColor: "border-color",
  color: "color",
  outlineColor: "outline-color",
};

export const ColorStates = enumeratedLiterals(["focused", "hovered", "normal"] as const);
export type ColorState = EnumeratedLiteralType<typeof ColorStates>;

export type ColorProp = Color | { [key in ColorState]?: Color };

export const parseColor = (color: Color): [ColorName, ColorShade | null] => {
  if (typeof color === "string") {
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
  } else if (Array.isArray(color)) {
    return [parseColor(color[0])[0], color[1]];
  }
  return color.shade === undefined ? parseColor(color.color) : [parseColor(color.color)[0], color.shade];
};

// type _ColorStateColors = Partial<Record<ColorState, Color | null>>;

const isColor = (p: ColorProp | null): p is Color =>
  (typeof p === "object" && !Array.isArray(p) && p !== null && "color" in p && typeof p.color === "string") ||
  (typeof p === "string" && !ColorStates.contains(p)) ||
  Array.isArray(p);

/* export function getHoveredColorClassName(propName: ColorPropName, color?: Color | null): string {
     return getColorClassName(propName, color, ColorStates.HOVERED);
   } */

/* export function getFocusedColorClassName(propName: ColorPropName, color?: Color | null): string {
     return getColorClassName(propName, color, ColorStates.FOCUSED);
   } */

export function getColorClassName(prop: ColorPropName, color?: ColorProp | null): string;
export function getColorClassName(
  prop: ColorPropName,
  color?: Color | null,
  state?: Exclude<ColorState, "normal">,
): string;
/* export function getColorClassName(prop: ColorPropName, color?: Color | null, state?: _ColorStateColors): string;
   export function getColorClassName(prop: ColorPropName, state: _ColorStateColors): string; */

export function getColorClassName(
  propName: ColorPropName,
  arg1?: ColorProp | null,
  arg2?: Exclude<ColorState, "normal">,
): string {
  if (arg1) {
    if (isColor(arg1)) {
      const [name, sh] = parseColor(arg1);
      if (!arg2) {
        return sh !== null ? `${ColorPropNameMap[propName]}-${name}-${sh}` : `${ColorPropNameMap[propName]}-${name}`;
      }
      return `${getColorClassName(propName, [name, sh])}-${arg2}`;
    }
    return classNames(
      getColorClassName(propName, arg1.normal),
      getColorClassName(propName, arg1.hovered, "hovered"),
      getColorClassName(propName, arg1.focused, "focused"),
    );
  }
  return "";
}
