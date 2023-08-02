import React from "react";

import classNames from "classnames";

import { getColorClassName, type ComponentProps, type Color, type ColorProps } from "~/lib/ui";
import { type IconProp } from "~/components/icons";
import { Icon } from "~/components/icons/Icon";
import { type TypographySize, TypographySizes, type FontWeight, FontWeights } from "~/components/typography";

export interface BadgeProps extends ComponentProps, ColorProps<"color" | "backgroundColor" | "outlineColor"> {
  readonly children: string;
  readonly size?: TypographySize;
  readonly fontWeight?: FontWeight;
  readonly iconColor?: Color;
  readonly icon?: IconProp;
}

export const Badge = ({
  color = "gray.8",
  backgroundColor = "gray.1",
  children,
  fontWeight = FontWeights.SEMIBOLD,
  size = TypographySizes.MD,
  icon,
  outlineColor,
  iconColor,
  ...props
}: BadgeProps): JSX.Element => (
  <div
    {...props}
    className={classNames(
      "badge",
      getColorClassName("color", color),
      getColorClassName("backgroundColor", backgroundColor),
      getColorClassName("outlineColor", outlineColor),
      `badge--size-${size}`,
      `font-weight-${fontWeight}`,
      props.className,
    )}
  >
    <div className="badge__content">
      <Icon
        className={classNames("badge__icon", getColorClassName("color", iconColor))}
        icon={icon}
        axis="horizontal"
      />
      <div className="badge_text">{children}</div>
    </div>
  </div>
);
