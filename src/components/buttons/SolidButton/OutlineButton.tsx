import classNames from "classnames";

import { ButtonVariants } from "../types";

import { BaseSolidButton, type BaseSolidButtonProps } from "./BaseSolidButton";

export type OutlineButtonProps = Omit<BaseSolidButtonProps<typeof ButtonVariants.OUTLINE>, "variant"> & {
  readonly condensed?: boolean;
};

export const OutlineButton = ({ condensed, ...props }: OutlineButtonProps) => (
  <BaseSolidButton
    {...props}
    className={classNames(props.className, { "button--condensed": condensed })}
    variant={ButtonVariants.OUTLINE}
  />
);
