import React from "react";

import classNames from "classnames";

import {
  type ComponentProps,
  type Color,
  type MarginProps,
  type HTMLElementProps,
  type ComponentNativeProps,
  getComponentNativeProps,
} from "~/lib/ui";
import { type FontWeight, type TypographySize } from "~/components/typography";

export interface TextProps extends ComponentProps, MarginProps {
  readonly children: React.ReactNode;
  readonly color?: Color;
  readonly span?: true;
  readonly size?: TypographySize;
  readonly truncate?: boolean;
  readonly fontWeight?: FontWeight;
  readonly lineClamp?: number;
}

const Span = (props: HTMLElementProps<"span"> & ComponentNativeProps): JSX.Element => <span {...props} />;

const Div = (props: HTMLElementProps<"div"> & ComponentNativeProps): JSX.Element => <div {...props} />;

export const Text = ({
  children,
  size,
  fontWeight,
  style,
  span,
  lineClamp,
  truncate = false,
  ...props
}: TextProps): JSX.Element => {
  const Component = span ? Span : Div;
  return (
    <Component
      {...getComponentNativeProps(
        {
          style: lineClamp ? { ...style, lineClamp } : style,
          className: classNames(
            "body",
            { span },
            size && `font-size-${size}`,
            fontWeight && `font-weight-${fontWeight}`,
            { truncate: truncate, clamp: lineClamp !== undefined },
          ),
        },
        props,
      )}
    >
      {children}
    </Component>
  );
};
