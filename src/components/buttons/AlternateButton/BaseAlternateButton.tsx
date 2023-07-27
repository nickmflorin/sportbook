import classNames from "classnames";

import { type FontWeight, type TypographySize } from "~/lib/ui";
import { ButtonTypes, type ButtonVariant } from "~/components/buttons";

import { ContentButton, type ContentButtonProps } from "../base";

export type BaseAlternateButtonProps<V extends ButtonVariant> = Omit<
  ContentButtonProps<typeof ButtonTypes.ALTERNATE>,
  "buttonType"
> & {
  readonly variant: V;
  readonly fontWeight?: FontWeight;
  readonly fontSize?: TypographySize;
};

export const BaseAlternateButton = <V extends ButtonVariant>({
  variant,
  fontWeight,
  fontSize,
  ...props
}: BaseAlternateButtonProps<V>) => (
  <ContentButton
    {...props}
    buttonType={ButtonTypes.ALTERNATE}
    className={classNames(
      `button--alternate--${variant}`,
      fontWeight && `font-weight-${fontWeight}`,
      fontSize && `font-size-${fontSize}`,
      props.className,
    )}
  />
);
