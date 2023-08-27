import classNames from "classnames";

import { type Alignment } from "~/lib/ui";
import { ButtonTypes, type ButtonVariant } from "~/components/buttons";
import { type FontWeight, type TypographySize } from "~/components/typography";

import { Button, type ButtonProps } from "../Button";

export type BaseAlternateButtonProps<V extends ButtonVariant> = Omit<
  ButtonProps<typeof ButtonTypes.ALTERNATE, V>,
  "buttonType"
> & {
  readonly fontWeight?: FontWeight;
  readonly fontSize?: TypographySize;
  readonly textAlign?: Alignment;
};

export const BaseAlternateButton = <V extends ButtonVariant>({
  fontWeight,
  fontSize,
  textAlign,
  ...props
}: BaseAlternateButtonProps<V>) => (
  <Button
    {...props}
    buttonType={ButtonTypes.ALTERNATE}
    className={classNames(
      fontWeight && `font-weight-${fontWeight}`,
      fontSize && `font-size-${fontSize}`,
      textAlign && `text-align-${textAlign}`,
      props.className,
    )}
  />
);
