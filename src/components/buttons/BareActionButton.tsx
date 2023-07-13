import classNames from "classnames";

import { getColorClassName, type Color } from "~/lib/ui";
import { ButtonActionVariants } from "~/components/buttons";

import { ActionButton, type ActionButtonProps } from "./abstract";

export type BareActionButtonProps = Omit<ActionButtonProps<typeof ButtonActionVariants.BARE>, "variant"> & {
  readonly color?: Color;
};

export const BareActionButton = ({ color, ...props }: BareActionButtonProps) => (
  <ActionButton
    {...props}
    variant={ButtonActionVariants.BARE}
    className={classNames(getColorClassName("color", { color }), props.className)}
  />
);
