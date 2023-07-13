import classNames from "classnames";

import { getColorClassName, type Color } from "~/lib/ui";
import { ButtonActionVariants } from "~/components/buttons";

import { ActionButton, type ActionButtonProps } from "./abstract";

export type BareActionButtonProps = Omit<ActionButtonProps<typeof ButtonActionVariants.BARE>, "variant"> & {
  readonly color?: Color;
  readonly hoveredColor?: Color;
  readonly focusedColor?: Color;
};

export const BareActionButton = ({ color, hoveredColor, focusedColor, ...props }: BareActionButtonProps) => (
  <ActionButton
    {...props}
    variant={ButtonActionVariants.BARE}
    className={classNames(
      getColorClassName("color", { color }),
      getColorClassName("color", { color: hoveredColor, state: "hovered" }),
      getColorClassName("color", { color: focusedColor, state: "focused" }),
      props.className,
    )}
  />
);
