import classNames from "classnames";

import { type ButtonVariant, ButtonTypes } from "~/components/buttons";

import { ContentButton, type ContentButtonProps } from "../abstract/ContentButton";

export type BaseSolidButtonProps<V extends ButtonVariant> = Omit<
  ContentButtonProps<typeof ButtonTypes.SOLID>,
  "buttonType"
> & {
  readonly variant: V;
};

export const BaseSolidButton = <V extends ButtonVariant>({ variant, ...props }: BaseSolidButtonProps<V>) => (
  <ContentButton
    {...props}
    buttonType={ButtonTypes.SOLID}
    className={classNames(`button--solid--${variant}`, props.className)}
  />
);
