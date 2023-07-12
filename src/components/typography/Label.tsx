import classNames from "classnames";

import {
  type ComponentProps,
  type TypographySize,
  TypographySizes,
  type FontWeight,
  FontWeights,
  type Color,
  getColorClassName,
} from "~/lib/ui";

export interface LabelProps extends ComponentProps {
  readonly children: string;
  readonly color?: Color;
  readonly size?: TypographySize;
  readonly fontWeight?: FontWeight;
}

export const Label = ({
  children,
  color = "body",
  size = TypographySizes.MD,
  fontWeight = FontWeights.REGULAR,
  style,
  className,
}: LabelProps): JSX.Element => (
  <label
    style={style}
    className={classNames(
      "label",
      getColorClassName("color", { color }),
      `font-size-${size}`,
      `font-weight-${fontWeight}`,
      className,
    )}
  >
    {children}
  </label>
);
