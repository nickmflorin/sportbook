import { type CSSProperties } from "react";

import classNames from "classnames";
import { type ArgumentArray, type Argument } from "classnames";

import { type HTMLElementName, type HTMLElementTag } from "~/lib/core";
import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

import { type ColorPropName, type ColorProp, getColorClassName, ColorPropNames } from "./colors";
import {
  MarginPropNames,
  type MarginPropName,
  PaddingPropNames,
  type PaddingPropName,
  type Spacing,
  getMarginClassName,
  getPaddingClassName,
} from "./spacing";

export const BorderRadiusSizes = enumeratedLiterals(["xs", "sm", "md", "lg", "xl"] as const);
export type BorderRadiusSize = EnumeratedLiteralType<typeof BorderRadiusSizes>;

export const Alignments = enumeratedLiterals(["left", "center", "right"] as const);
export type Alignment = EnumeratedLiteralType<typeof Alignments>;

export const FlexDirections = enumeratedLiterals(["row", "column"] as const);
export type FlexDirection = EnumeratedLiteralType<typeof FlexDirections>;

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

export type ColorProps<N extends ColorPropName = ColorPropName> = { [k in N]?: ColorProp };

export type MarginProps = { [key in MarginPropName]?: Spacing };

export type PaddingProps = { [key in PaddingPropName]?: Spacing };

export type AllComponentProps = ComponentProps & ColorProps & MarginProps & PaddingProps;

export const getComponentNativeProps = <Pargs extends P[], P extends AllComponentProps>(
  ...props: Pargs
): ComponentNativeProps =>
  props.reduce(
    (running: ComponentProps, p: P) => ({
      ...running,
      style: { ...running.style, ...p.style },
      className: classNames(
        running.className,
        p.className,
        ColorPropNames.reduce(
          (prev: string, propName) => classNames(prev, getColorClassName(propName, p[propName])),
          "",
        ),
        MarginPropNames.reduce(
          (prev: string, propName: MarginPropName) => classNames(prev, getMarginClassName(propName, p[propName])),
          "",
        ),
        PaddingPropNames.reduce(
          (prev: string, propName: PaddingPropName) => classNames(prev, getPaddingClassName(propName, p[propName])),
          "",
        ),
      ),
    }),
    { style: {}, className: "" },
  );
