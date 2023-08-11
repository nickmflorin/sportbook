import classNames from "classnames";

import { getColorClassName, type Color } from "~/lib/ui";
import { ButtonVariants } from "~/components/buttons";

import { BaseAlternateButton, type BaseAlternateButtonProps } from "./BaseAlternateButton";

export type BareAlternateButtonProps = Omit<BaseAlternateButtonProps<typeof ButtonVariants.BARE>, "variant"> & {
  readonly color?: Color;
  readonly hoveredColor?: Color;
  readonly focusedColor?: Color;
};

export const BareAlternateButton = ({ color, hoveredColor, focusedColor, ...props }: BareAlternateButtonProps) => (
  <BaseAlternateButton
    {...props}
    variant={ButtonVariants.BARE}
    className={classNames(
      getColorClassName("color", { normal: color, hovered: hoveredColor, focused: focusedColor }),
      props.className,
    )}
  />
);
