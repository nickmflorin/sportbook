import React from "react";

import classNames from "classnames";

import {
  type FontWeight,
  FontWeights,
  getColorClassName,
  type ComponentProps,
  type Color,
  type TypographySize,
  TypographySizes,
} from "~/lib/ui";

export interface BadgeProps extends ComponentProps {
  readonly children: string;
  readonly color?: Color;
  readonly backgroundColor?: Color;
  readonly size?: TypographySize;
  readonly fontWeight?: FontWeight;
}

export const Badge = ({
  color = "gray.8",
  backgroundColor = "gray.1",
  children,
  fontWeight = FontWeights.SEMIBOLD,
  size = TypographySizes.MD,
  ...props
}: BadgeProps): JSX.Element => (
  <div
    {...props}
    className={classNames(
      "badge",
      getColorClassName("color", color),
      getColorClassName("backgroundColor", backgroundColor),
      `badge--size-${size}`,
      `font-weight-${fontWeight}`,
      props.className,
    )}
  >
    {children}
  </div>
);
