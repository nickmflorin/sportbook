import classNames from "classnames";

import { type FontWeight, type TypographySize } from "~/lib/ui";
import { ButtonTypes, type ButtonVariant } from "~/components/buttons";

import { Button, type ButtonProps } from "../base";

export type BaseAlternateButtonProps<V extends ButtonVariant> = Omit<
  ButtonProps<typeof ButtonTypes.ALTERNATE, V>,
  "buttonType"
> & {
  readonly fontWeight?: FontWeight;
  readonly fontSize?: TypographySize;
};

export const BaseAlternateButton = <V extends ButtonVariant>({
  fontWeight,
  fontSize,
  ...props
}: BaseAlternateButtonProps<V>) => (
  <Button
    {...props}
    buttonType={ButtonTypes.ALTERNATE}
    className={classNames(
      fontWeight && `font-weight-${fontWeight}`,
      fontSize && `font-size-${fontSize}`,
      props.className,
    )}
  />
);
