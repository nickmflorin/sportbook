import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

export const Spacings = enumeratedLiterals(["xxs", "xs", "sm", "md", "lg", "xl", "xll", "xlll"] as const);
export type Spacing = EnumeratedLiteralType<typeof Spacings>;

export const SpacingSides = enumeratedLiterals(["t", "r", "b", "l"] as const);
export type SpacingSide = EnumeratedLiteralType<typeof SpacingSides>;

export type MarginPropName = "m" | `m${SpacingSide}`;
export const MarginPropNames = ["m", "mt", "mb", "ml", "mr"] as const;

export type MarginClassName = `${MarginPropName}-${Spacing}`;

export function getMarginClassName(side: SpacingSide, size?: Spacing | null): MarginClassName;
export function getMarginClassName(size?: Spacing | null): MarginClassName;
export function getMarginClassName(propName: MarginPropName, size?: Spacing | null): MarginClassName;
export function getMarginClassName(
  side?: MarginPropName | SpacingSide | Spacing | null,
  size?: Spacing | null,
): MarginClassName | "" {
  if (side && SpacingSides.contains(side)) {
    return size ? `m${side}-${size}` : "";
  } else if (side && Spacings.contains(side)) {
    return `m-${side}`;
  } else if (side) {
    return size ? `${side}-${size}` : "";
  }
  return "";
}
