import { type CSSProperties } from "react";

import classNames, { type ArgumentArray, type Argument } from "classnames";

import { removeObjAttributes } from "~/lib/util";
import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

import { type Color, getColorClassName } from "./colors";

type ComponentNativeProps = {
  readonly style?: Style;
  readonly className?: string;
};

export const ComponentFontSizes = enumeratedLiterals(["xxs", "xs", "sm", "md", "lg", "xl"] as const);
export type ComponentFontSize = EnumeratedLiteralType<typeof ComponentFontSizes>;

export const ComponentFontWeights = enumeratedLiterals(["light", "regular", "medium", "semibold", "bold"] as const);
export type ComponentFontWeight = EnumeratedLiteralType<typeof ComponentFontWeights>;

const ComponentColorPropNames = ["backgroundColor", "color", "borderColor"] as const;
type ComponentColorPropName = (typeof ComponentColorPropNames)[number];

const ComponentPropNames = ["className", "style", "fontSize", "fontWeight", ...ComponentColorPropNames] as const;
export type ComponentPropName = (typeof ComponentPropNames)[number];

export type ClassName = ArgumentArray | Argument;
export type Style = Omit<CSSProperties, ComponentColorPropName>;

type ComponentPropType<N extends ComponentPropName> = (Record<ComponentColorPropName, Color> & {
  fontSize: ComponentFontSize;
  fontWeight: ComponentFontWeight;
  style: Style;
  className: ClassName;
})[N];

type ComponentPropConfig<N extends ComponentPropName> = {
  readonly name: N;
  readonly merge: (
    prev: ComponentProps<N | "className" | "style">,
    value: ComponentPropType<N> | undefined,
  ) => ComponentProps<N | "className" | "style">;
  readonly flatten: (prev: ComponentNativeProps, value: ComponentPropType<N> | undefined) => ComponentNativeProps;
};

export type ComponentProps<K extends ComponentPropName = ComponentPropName> = Partial<{
  [key in K]: ComponentPropType<key>;
}>;

const ComponentPropConfigs: {
  [key in ComponentPropName]: Omit<ComponentPropConfig<key>, "name">;
} = {
  fontSize: {
    merge: (prev, fontSize) => ({
      ...prev,
      fontSize: fontSize || prev.fontSize,
    }),
    flatten: (prev, fontSize) => ({
      ...prev,
      className: classNames(prev.className, fontSize && `font-size-${fontSize}`),
    }),
  },
  fontWeight: {
    merge: (prev, fontWeight) => ({
      ...prev,
      fontSize: fontWeight || prev.fontWeight,
    }),
    flatten: (prev, fontWeight) => ({
      ...prev,
      className: classNames(prev.className, fontWeight && `font-weight-${fontWeight}`),
    }),
  },
  backgroundColor: {
    merge: (prev, color) => ({
      ...prev,
      backgroundColor: color || prev.backgroundColor,
    }),
    flatten: (prev, color) => ({
      ...prev,
      className: classNames(prev.className, color && getColorClassName("backgroundColor", { color })),
    }),
  },
  color: {
    merge: (prev, color) => ({
      ...prev,
      color: color || prev.color,
    }),
    flatten: (prev, color) => ({
      ...prev,
      className: classNames(prev.className, color && getColorClassName("color", { color })),
    }),
  },
  borderColor: {
    merge: (prev, color) => ({
      ...prev,
      borderColor: color || prev.borderColor,
    }),
    flatten: (prev, color) => ({
      ...prev,
      className: classNames(prev.className, color && getColorClassName("borderColor", { color })),
    }),
  },
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
