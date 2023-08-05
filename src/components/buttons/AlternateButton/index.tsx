import { type ButtonVariant, ButtonVariants } from "~/components/buttons";

import { BareAlternateButton, type BareAlternateButtonProps } from "./BareAlternateButton";
import { DangerAlternateButton, type DangerAlternateButtonProps } from "./DangerAlternateButton";
import { PrimaryAlternateButton, type PrimaryAlternateButtonProps } from "./PrimaryAlternateButton";
import { SecondaryAlternateButton, type SecondaryAlternateButtonProps } from "./SecondaryAlternateButton";

export type AlternateButtonPolymorphicProps<V extends ButtonVariant> = {
  bare: BareAlternateButtonProps;
  primary: PrimaryAlternateButtonProps;
  secondary: SecondaryAlternateButtonProps;
  danger: DangerAlternateButtonProps;
  outline: never;
}[V];

export type AlternateButtonProps<V extends ButtonVariant = ButtonVariant> = {
  readonly variant: V;
} & AlternateButtonPolymorphicProps<V>;

export type AlternateButton = {
  <V extends ButtonVariant>(props: AlternateButtonProps<V>): JSX.Element;
  Primary: (props: AlternateButtonPolymorphicProps<"primary">) => JSX.Element;
  Secondary: (props: AlternateButtonPolymorphicProps<"secondary">) => JSX.Element;
  Danger: (props: AlternateButtonPolymorphicProps<"danger">) => JSX.Element;
  Bare: (props: AlternateButtonPolymorphicProps<"bare">) => JSX.Element;
};

const _AlternateButton = <V extends ButtonVariant>({ variant, ...props }: AlternateButtonProps<V>): JSX.Element => {
  switch (variant) {
    case ButtonVariants.BARE:
      return <BareAlternateButton {...props} />;
    case ButtonVariants.PRIMARY:
      return <PrimaryAlternateButton {...props} />;
    case ButtonVariants.SECONDARY:
      return <SecondaryAlternateButton {...props} />;
    case ButtonVariants.DANGER:
      return <DangerAlternateButton {...props} />;
    case ButtonVariants.OUTLINE:
      throw new Error("The 'outline' variant is not applicable for alternate buttons!");
    default:
      // I do not know why TS is not picking this case up as the never type.
      throw new Error(`Invalid variant ${variant}!`);
  }
};

export const AlternateButton: AlternateButton = Object.assign(_AlternateButton, {
  Primary: (props: AlternateButtonPolymorphicProps<"primary">) => <PrimaryAlternateButton {...props} />,
  Secondary: (props: AlternateButtonPolymorphicProps<"secondary">) => <SecondaryAlternateButton {...props} />,
  Danger: (props: AlternateButtonPolymorphicProps<"danger">) => <DangerAlternateButton {...props} />,
  Bare: (props: AlternateButtonPolymorphicProps<"bare">) => <BareAlternateButton {...props} />,
});
