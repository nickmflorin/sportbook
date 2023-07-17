import { BaseSolidButton, type BaseSolidButtonProps } from "./BaseSolidButton";
import { ButtonVariants } from "../types";

import classNames from "classnames";

import { getColorClassName, type Color } from "~/lib/ui";

export type BareButtonProps = Omit<BaseSolidButtonProps<typeof ButtonVariants.BARE>, "variant"> & {
  readonly color?: Color;
  readonly hoveredColor?: Color;
  readonly focusedColor?: Color;
};

export const BareButton = ({ color, hoveredColor, focusedColor, ...props }: BareButtonProps) => (
  <BaseSolidButton
    {...props}
    className={classNames(
      getColorClassName("color", color, { hovered: hoveredColor, focused: focusedColor }),
      props.className,
    )}
    variant={ButtonVariants.BARE}
  />
);