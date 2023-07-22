import classNames from "classnames";

import { type ComponentProps, type TypographySize, type FontWeight, type Color, getColorClassName } from "~/lib/ui";

export interface LabelProps extends ComponentProps {
  readonly children: string | number | undefined | null | false;
  readonly color?: Color;
  readonly size?: TypographySize;
  readonly fontWeight?: FontWeight;
}

export const Label = ({ children, color, size, fontWeight, style, className }: LabelProps): JSX.Element => (
  <label
    style={style}
    className={classNames(
      "label",
      getColorClassName("color", color),
      size && `font-size-${size}`,
      fontWeight && `font-weight-${fontWeight}`,
      className,
    )}
  >
    {children}
  </label>
);
