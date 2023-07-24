import classNames from "classnames";

import { ButtonTypes, type ButtonVariant } from "~/components/buttons";

import { ContentButton, type ContentButtonProps } from "../base";

export type BaseAlternateButtonProps<V extends ButtonVariant> = Omit<
  ContentButtonProps<typeof ButtonTypes.ALTERNATE>,
  "buttonType"
> & {
  readonly variant: V;
};

export const BaseAlternateButton = <V extends ButtonVariant>({ variant, ...props }: BaseAlternateButtonProps<V>) => (
  <ContentButton
    {...props}
    buttonType={ButtonTypes.ALTERNATE}
    className={classNames(`button--alternate--${variant}`, props.className)}
  />
);
