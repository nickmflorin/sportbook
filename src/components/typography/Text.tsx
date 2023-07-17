import classNames from "classnames";

import {
  type ComponentProps,
  type TypographySize,
  TypographySizes,
  type FontWeight,
  type Color,
  getColorClassName,
} from "~/lib/ui";

export interface TextProps extends ComponentProps {
  readonly children: string;
  readonly color?: Color;
  readonly size?: TypographySize;
  readonly truncate?: boolean;
  readonly fontWeight?: FontWeight;
}

export const Text = ({
  children,
  color = "body",
  size = TypographySizes.MD,
  // Let the weight default in SASS baed on the size.
  fontWeight,
  style,
  className,
  truncate = false,
}: TextProps): JSX.Element => (
  <div
    style={style}
    className={classNames(
      "body",
      getColorClassName("color", color),
      `font-size-${size}`,
      fontWeight && `font-weight-${fontWeight}`,
      { truncate },
      className,
    )}
  >
    {children}
  </div>
);
