import classNames from "classnames";

import { getColorClassName, type Color } from "~/lib/ui";
import { ButtonVariants } from "~/components/buttons";

import { BaseActionButton, type BaseActionButtonProps } from "./BaseActionButton";

export type BareActionButtonProps = Omit<BaseActionButtonProps<typeof ButtonVariants.BARE>, "variant"> & {
  readonly color?: Color;
  readonly hoveredColor?: Color;
  readonly focusedColor?: Color;
};

export const BareActionButton = ({ color, hoveredColor, focusedColor, ...props }: BareActionButtonProps) => (
  <BaseActionButton
    {...props}
    variant={ButtonVariants.BARE}
    className={classNames(
      getColorClassName("color", { normal: color, hovered: hoveredColor, focused: focusedColor }),
      props.className,
    )}
  />
);
