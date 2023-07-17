import { ButtonVariants } from "../types";

import { BaseSolidButton, type BaseSolidButtonProps } from "./BaseSolidButton";

export type DangerButtonProps = Omit<BaseSolidButtonProps<typeof ButtonVariants.DANGER>, "variant">;

export const DangerButton = (props: DangerButtonProps) => (
  <BaseSolidButton {...props} variant={ButtonVariants.DANGER} />
);
