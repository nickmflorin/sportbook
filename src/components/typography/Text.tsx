import classNames from "classnames";

import {
  type ComponentProps,
  type TypographySize,
  TypographySizes,
  type FontWeight,
  type Color,
  type Style,
  getColorClassName,
} from "~/lib/ui";

export interface TextProps extends ComponentProps {
  readonly children: string;
  readonly color?: Color;
  readonly size?: TypographySize;
  readonly truncate?: boolean;
  readonly fontWeight?: FontWeight;
  readonly lineClamp?: number;
}

export const Text = ({
  children,
  color = "body",
  size = TypographySizes.MD,
  // Let the weight default in SASS baed on the size.
  fontWeight,
  style,
  lineClamp,
  className,
  truncate = false,
}: TextProps): JSX.Element => (
  <div
    style={lineClamp ? { ...style, ["-webkit-line-clamp" as keyof Style]: lineClamp } : style}
    className={classNames(
      "body",
      getColorClassName("color", color),
      `font-size-${size}`,
      fontWeight && `font-weight-${fontWeight}`,
      { truncate: truncate, clamp: lineClamp !== undefined },
      className,
    )}
  >
    {children}
  </div>
);
