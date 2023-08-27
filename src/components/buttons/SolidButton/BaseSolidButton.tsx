import { type ButtonVariant, ButtonTypes } from "~/components/buttons";

import { Button, type ButtonProps } from "../Button";

export type BaseSolidButtonProps<V extends ButtonVariant> = Omit<
  ButtonProps<typeof ButtonTypes.SOLID, V>,
  "buttonType"
>;

export const BaseSolidButton = <V extends ButtonVariant>(props: BaseSolidButtonProps<V>) => (
  <Button {...props} buttonType={ButtonTypes.SOLID} />
);
