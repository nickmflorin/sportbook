import { type CSSProperties } from "react";

import classNames, { type ArgumentArray, type Argument } from "classnames";

import { removeObjAttributes } from "~/lib/util";
import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

import { type ColorPropName } from "./colors";

export const TypographytSizes = enumeratedLiterals(["xxs", "xs", "sm", "md", "lg", "xl"] as const);
export type TypoegraphySize = EnumeratedLiteralType<typeof TypographytSizes>;

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

type ComponentNativeProps = {
  readonly style?: Style;
  readonly className?: string;
};

type ComponentPropConfig<N extends ComponentPropName> = {
  readonly name: N;
  readonly merge: (prev: ComponentProps, value: ComponentPropType<N> | undefined) => ComponentProps;
  readonly flatten: (prev: ComponentNativeProps, value: ComponentPropType<N> | undefined) => ComponentNativeProps;
};

export type ComponentProps = Partial<{
  [key in ComponentPropName]: ComponentPropType<key>;
}>;

const ComponentPropConfigs: {
  [key in ComponentPropName]: Omit<ComponentPropConfig<key>, "name">;
} = {
  className: {
    merge: (prev, value) => ({ ...prev, className: classNames(prev.className, value) }),
    flatten: (prev, value) => ({ ...prev, className: classNames(prev.className, value) }),
  },
  style: {
    merge: (prev, value) => ({ ...prev, style: { ...prev.style, ...value } }),
    flatten: (prev, value) => ({ ...prev, style: { ...prev.style, ...value } }),
  },
};

const _mergeComponentProps = (a: ComponentProps, b: ComponentProps): ComponentProps =>
  [...ComponentPropNames].reduce(
    <N extends ComponentPropName>(prev: ComponentProps, name: N): ComponentProps =>
      ComponentPropConfigs[name].merge(prev, b[name]),
    a,
  );

export const flattenComponentProps = <C extends ComponentProps>(
  props: C,
): Omit<C, keyof ComponentProps> & ComponentNativeProps => ({
  ...(removeObjAttributes(props, [...ComponentPropNames]) as Omit<C, keyof ComponentProps>),
  ...[...ComponentPropNames].reduce(
    <N extends ComponentPropName>(prev: ComponentNativeProps, name: N): ComponentNativeProps =>
      ComponentPropConfigs[name].flatten(prev, (props as ComponentProps)[name]),
    {} as ComponentNativeProps,
  ),
});

export const mergeComponentProps = (...args: ComponentProps[]): ComponentProps =>
  args.reduce((prev: ComponentProps, curr: ComponentProps) => _mergeComponentProps(prev, curr));

export const prepareNativeComponentProps = (...args: ComponentProps[]): ComponentNativeProps =>
  flattenComponentProps(mergeComponentProps(...args));

export const pluckNativeComponentProps = <C extends ComponentProps>(
  ...args: [...ComponentProps[], C]
): [Omit<C, keyof ComponentProps>, ComponentNativeProps] => {
  const providedProps = args[args.length - 1];
  if (providedProps === undefined) {
    throw new Error("No props were provided!");
  }
  return [
    removeObjAttributes(providedProps, [...ComponentPropNames]) as Omit<C, keyof ComponentProps>,
    prepareNativeComponentProps(...args),
  ];
};
