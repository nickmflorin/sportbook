import { type EnumeratedLiteralType, enumeratedLiterals } from "../util/literals";

import { type Color, getColorClassName } from "./colors";

export const BorderSides = enumeratedLiterals(["top", "right", "bottom", "left"] as const);
export type BorderSide = EnumeratedLiteralType<typeof BorderSides>;

export type BorderWidth = 1 | 2;

export const BorderStyles = enumeratedLiterals(["solid", "dashed", "dotted"] as const);
export type BorderStyle = EnumeratedLiteralType<typeof BorderStyles>;

export type SideBorder = { side: BorderSide; color?: Color | "default" };
export type SidesBorder = { sides: BorderSide[]; color?: Color | "default" };

export type BorderProp = true | Color | "default" | SideBorder | SideBorder[] | SidesBorder | SidesBorder[];

export const NaiveBorderSchema = {};

// Leaving for now - will likely get rid of.
export const getBorderClassName = (prop: BorderProp): string => {
  if (prop === true || prop === "default") {
    return "border-color-default";
  } else if (!Array.isArray(prop)) {
    if (typeof prop === "string") {
      return getColorClassName("borderColor", prop);
    } else {
      return `border-color-${prop.color}`;
    }
  }
  return "";
};
