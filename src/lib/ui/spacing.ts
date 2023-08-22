import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

export const Spacings = enumeratedLiterals(["xxs", "xs", "sm", "md", "lg", "xl", "xll", "xlll"] as const);
export type Spacing = EnumeratedLiteralType<typeof Spacings>;

export const SpacingSides = enumeratedLiterals(["t", "r", "b", "l"] as const);
export type SpacingSide = EnumeratedLiteralType<typeof SpacingSides>;

export type MarginPropName = "m" | `m${SpacingSide}`;
export const MarginPropNames = ["m", "mt", "mb", "ml", "mr"] as const;

export type PaddingPropName = "p" | `p${SpacingSide}`;
export const PaddingPropNames = ["p", "pt", "pb", "pl", "pr"] as const;

export type MarginClassName = `${MarginPropName}-${Spacing}`;
export type PaddingClassName = `${PaddingPropName}-${Spacing}`;

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

export function getPaddingClassName(side: SpacingSide, size?: Spacing | null): PaddingClassName;
export function getPaddingClassName(size?: Spacing | null): PaddingClassName;
export function getPaddingClassName(propName: PaddingPropName, size?: Spacing | null): PaddingClassName;
export function getPaddingClassName(
  side?: PaddingPropName | SpacingSide | Spacing | null,
  size?: Spacing | null,
): PaddingClassName | "" {
  if (side && SpacingSides.contains(side)) {
    return size ? `p${side}-${size}` : "";
  } else if (side && Spacings.contains(side)) {
    return `p-${side}`;
  } else if (side) {
    return size ? `${side}-${size}` : "";
  }
  return "";
}
