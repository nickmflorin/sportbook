import classNames from "classnames";

import { ButtonTypes, type ButtonAlternateVariant } from "~/components/buttons";

import { ContentButton, type ContentButtonProps } from "./ContentButton";

export type AlternateButtonProps<V extends ButtonAlternateVariant> = Omit<
  ContentButtonProps<typeof ButtonTypes.ALTERNATE>,
  "buttonType"
> & {
  readonly variant: V;
};

export const AlternateButton = <V extends ButtonAlternateVariant>({ variant, ...props }: AlternateButtonProps<V>) => (
  <ContentButton
    {...props}
    buttonType={ButtonTypes.ALTERNATE}
    className={classNames(`button--alternate--${variant}`, props.className)}
  />
);
