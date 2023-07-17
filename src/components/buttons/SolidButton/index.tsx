import { type ButtonVariant, ButtonVariants } from "~/components/buttons";

import { BareButton, type BareButtonProps } from "./BareButton";
import { DangerButton, type DangerButtonProps } from "./DangerButton";
import { PrimaryButton, type PrimaryButtonProps } from "./PrimaryButton";
import { SecondaryButton, type SecondaryButtonProps } from "./SecondaryButton";

export type SolidButtonPolymorphicProps<V extends ButtonVariant> = {
  bare: BareButtonProps;
  primary: PrimaryButtonProps;
  secondary: SecondaryButtonProps;
  danger: DangerButtonProps;
}[V];

export type SolidButtonProps<V extends ButtonVariant> = { readonly variant: V } & SolidButtonPolymorphicProps<V>;

export type SolidButton = {
  <V extends ButtonVariant>(props: SolidButtonProps<V>): JSX.Element;
  Primary: (props: SolidButtonPolymorphicProps<"primary">) => JSX.Element;
  Secondary: (props: SolidButtonPolymorphicProps<"secondary">) => JSX.Element;
  Danger: (props: SolidButtonPolymorphicProps<"danger">) => JSX.Element;
  Bare: (props: SolidButtonPolymorphicProps<"bare">) => JSX.Element;
};

const _SolidButton = <V extends ButtonVariant>({ variant, ...props }: SolidButtonProps<V>): JSX.Element => {
  switch (variant) {
    case ButtonVariants.BARE:
      return <BareButton {...props} />;
    case ButtonVariants.PRIMARY:
      return <PrimaryButton {...props} />;
    case ButtonVariants.SECONDARY:
      return <SecondaryButton {...props} />;
    case ButtonVariants.DANGER:
      return <DangerButton {...props} />;
    default:
      // I do not know why TS is not picking this case up as the never type.
      throw new Error(`Invalid variant ${variant}!`);
  }
};

export const SolidButton: SolidButton = Object.assign(_SolidButton, {
  Primary: (props: SolidButtonPolymorphicProps<"primary">) => <PrimaryButton {...props} />,
  Secondary: (props: SolidButtonPolymorphicProps<"secondary">) => <SecondaryButton {...props} />,
  Danger: (props: SolidButtonPolymorphicProps<"danger">) => <DangerButton {...props} />,
  Bare: (props: SolidButtonPolymorphicProps<"bare">) => <BareButton {...props} />,
});
