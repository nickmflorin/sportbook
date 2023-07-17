import { BaseSolidButton, type BaseSolidButtonProps } from "./BaseSolidButton";
import { ButtonVariants } from "../types";

export type SecondaryButtonProps = Omit<BaseSolidButtonProps<typeof ButtonVariants.SECONDARY>, "variant">;

export const SecondaryButton = (props: SecondaryButtonProps) => (
  <BaseSolidButton {...props} variant={ButtonVariants.SECONDARY} />
);
