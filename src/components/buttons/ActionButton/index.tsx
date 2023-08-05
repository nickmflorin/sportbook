import { type ButtonVariant, ButtonVariants } from "~/components/buttons";

import { BareActionButton, type BareActionButtonProps } from "./BareActionButton";
import { DangerActionButton, type DangerActionButtonProps } from "./DangerActionButton";
import { OutlineActionButton, type OutlineActionButtonProps } from "./OutlineActionButton";
import { PrimaryActionButton, type PrimaryActionButtonProps } from "./PrimaryActionButton";
import { SecondaryActionButton, type SecondaryActionButtonProps } from "./SecondaryActionButton";

export type ActionButtonPolymorphicProps<V extends ButtonVariant> = {
  bare: BareActionButtonProps;
  primary: PrimaryActionButtonProps;
  secondary: SecondaryActionButtonProps;
  danger: DangerActionButtonProps;
  outline: OutlineActionButtonProps;
}[V];

export type ActionButtonProps<V extends ButtonVariant> = { readonly variant: V } & ActionButtonPolymorphicProps<V>;

export type ActionButton = {
  <V extends ButtonVariant>(props: ActionButtonProps<V>): JSX.Element;
  Primary: (props: ActionButtonPolymorphicProps<"primary">) => JSX.Element;
  Secondary: (props: ActionButtonPolymorphicProps<"secondary">) => JSX.Element;
  Danger: (props: ActionButtonPolymorphicProps<"danger">) => JSX.Element;
  Bare: (props: ActionButtonPolymorphicProps<"bare">) => JSX.Element;
};

const _ActionButton = <V extends ButtonVariant>({ variant, ...props }: ActionButtonProps<V>): JSX.Element => {
  switch (variant) {
    case ButtonVariants.BARE:
      return <BareActionButton {...props} />;
    case ButtonVariants.PRIMARY:
      return <PrimaryActionButton {...props} />;
    case ButtonVariants.SECONDARY:
      return <SecondaryActionButton {...props} />;
    case ButtonVariants.DANGER:
      return <DangerActionButton {...props} />;
    case ButtonVariants.OUTLINE:
      return <OutlineActionButton {...props} />;
    default:
      // I do not know why TS is not picking this case up as the never type.
      throw new Error(`Invalid variant ${variant}!`);
  }
};

export const ActionButton: ActionButton = Object.assign(_ActionButton, {
  Primary: (props: ActionButtonPolymorphicProps<"primary">) => <PrimaryActionButton {...props} />,
  Secondary: (props: ActionButtonPolymorphicProps<"secondary">) => <SecondaryActionButton {...props} />,
  Danger: (props: ActionButtonPolymorphicProps<"danger">) => <DangerActionButton {...props} />,
  Bare: (props: ActionButtonPolymorphicProps<"bare">) => <BareActionButton {...props} />,
  Outline: (props: ActionButtonPolymorphicProps<"bare">) => <OutlineActionButton {...props} />,
});
