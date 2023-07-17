import { ButtonVariants } from "../types";

import { BaseSolidButton, type BaseSolidButtonProps } from "./BaseSolidButton";

export type PrimaryButtonProps = Omit<BaseSolidButtonProps<typeof ButtonVariants.PRIMARY>, "variant">;

export const PrimaryButton = (props: PrimaryButtonProps) => (
  <BaseSolidButton {...props} variant={ButtonVariants.PRIMARY} />
);
