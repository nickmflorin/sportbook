import { type CSSProperties } from "react";

import { type ArgumentArray, type Argument } from "classnames";

import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

import { type ColorPropName } from "./colors";

export const TypographySizes = enumeratedLiterals(["xxs", "xs", "sm", "md", "lg", "xl"] as const);
export type TypographySize = EnumeratedLiteralType<typeof TypographySizes>;

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
