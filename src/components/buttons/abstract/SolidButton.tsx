import classNames from "classnames";

import { type ButtonSolidVariant, ButtonTypes } from "~/components/buttons";

import { ContentButton, type ContentButtonProps } from "./ContentButton";

export type SolidButtonProps<V extends ButtonSolidVariant> = Omit<
  ContentButtonProps<typeof ButtonTypes.SOLID>,
  "buttonType"
> & {
  readonly variant: V;
};

export const SolidButton = <V extends ButtonSolidVariant>({ variant, ...props }: SolidButtonProps<V>) => (
  <ContentButton
    {...props}
    buttonType={ButtonTypes.SOLID}
    className={classNames(`button--solid--${variant}`, props.className)}
  />
);
