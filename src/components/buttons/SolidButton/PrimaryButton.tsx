import { BaseSolidButton, type BaseSolidButtonProps } from "./BaseSolidButton";
import { ButtonVariants } from "../types";

export type PrimaryButtonProps = Omit<BaseSolidButtonProps<typeof ButtonVariants.PRIMARY>, "variant">;

export const PrimaryButton = (props: PrimaryButtonProps) => (
  <BaseSolidButton {...props} variant={ButtonVariants.PRIMARY} />
);
