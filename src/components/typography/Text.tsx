import classNames from "classnames";

import { type ComponentProps, type Color, getColorClassName } from "~/lib/ui";
import { type FontWeight, type TypographySize } from "~/components/typography";

export interface TextProps extends ComponentProps {
  readonly children: string | number | undefined | null | false;
  readonly color?: Color;
  readonly size?: TypographySize;
  readonly truncate?: boolean;
  readonly fontWeight?: FontWeight;
  readonly lineClamp?: number;
}

export const Text = ({
  children,
  color,
  size,
  fontWeight,
  style,
  lineClamp,
  className,
  truncate = false,
}: TextProps): JSX.Element => (
  <div
    style={lineClamp ? { ...style, lineClamp } : style}
    className={classNames(
      "body",
      getColorClassName("color", color),
      size && `font-size-${size}`,
      fontWeight && `font-weight-${fontWeight}`,
      { truncate: truncate, clamp: lineClamp !== undefined },
      className,
    )}
  >
    {children}
  </div>
);
