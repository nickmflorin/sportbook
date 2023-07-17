import { BaseSolidButton, type BaseSolidButtonProps } from "./BaseSolidButton";
import { ButtonVariants } from "../types";

export type DangerButtonProps = Omit<BaseSolidButtonProps<typeof ButtonVariants.DANGER>, "variant">;

export const DangerButton = (props: DangerButtonProps) => (
  <BaseSolidButton {...props} variant={ButtonVariants.DANGER} />
);
