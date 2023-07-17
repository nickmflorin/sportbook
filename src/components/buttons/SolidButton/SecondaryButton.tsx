import { ButtonVariants } from "../types";

import { BaseSolidButton, type BaseSolidButtonProps } from "./BaseSolidButton";

export type SecondaryButtonProps = Omit<BaseSolidButtonProps<typeof ButtonVariants.SECONDARY>, "variant">;

export const SecondaryButton = (props: SecondaryButtonProps) => (
  <BaseSolidButton {...props} variant={ButtonVariants.SECONDARY} />
);
