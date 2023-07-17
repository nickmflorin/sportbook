import { type CSSProperties } from "react";

import { type ArgumentArray, type Argument } from "classnames";

import { type HTMLElementName, type HTMLElementTag } from "~/lib/core";
import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

import { type ColorPropName } from "./colors";

export const TypographySizes = enumeratedLiterals(["xxs", "xs", "sm", "md", "lg", "xl"] as const);
export type TypographySize = EnumeratedLiteralType<typeof TypographySizes>;

export const Spacings = enumeratedLiterals(["xs", "sm", "md", "lg", "xl", "xll", "xlll"] as const);
export type Spacing = EnumeratedLiteralType<typeof Spacings>;

export const Alignments = enumeratedLiterals(["left", "center", "right"] as const);
export type Alignment = EnumeratedLiteralType<typeof Alignments>;

export const FlexDirections = enumeratedLiterals(["row", "column"] as const);
export type FlexDirection = EnumeratedLiteralType<typeof FlexDirections>;

export const FontWeights = enumeratedLiterals(["light", "regular", "medium", "semibold", "bold"] as const);
export type FontWeight = EnumeratedLiteralType<typeof FontWeights>;

const ComponentPropNames = ["className", "style"] as const;
export type ComponentPropName = (typeof ComponentPropNames)[number];

export type ClassName = ArgumentArray | Argument;
export type Style = Omit<CSSProperties, ColorPropName>;

type ComponentPropType<N extends ComponentPropName> = {
  style: Style;
  className: ClassName;
}[N];

export type ComponentNativeProps = {
  readonly style?: Style;
  readonly className?: string;
};

export type ComponentProps = Partial<{
  [key in ComponentPropName]: ComponentPropType<key>;
}>;

export type _HTMLElementProps<E extends HTMLElement | HTMLElementName = HTMLElement> = E extends HTMLElement
  ? JSX.IntrinsicElements[HTMLElementTag<E>]
  : E extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[E]
  : never;

/**
 * The props that are associated with the {@link HTMLElement} dictated by the generic type argument, {@link E}, with the
 * internal type definitions injected.
 *
 * @example
 * HTMLElementProps<"div"> // Props for a <div> element with our internal definitions included.
 *
 * @example
 * // Props for a <div> element with our internal definitions included.
 * HTMLElementProps<HTMLDivElement>
 */
export type HTMLElementProps<E extends HTMLElement | HTMLElementName = HTMLElement> = Omit<
  _HTMLElementProps<E>,
  keyof ComponentProps
>;
