import { ButtonVariants } from "../types";

import { BaseSolidButton, type BaseSolidButtonProps } from "./BaseSolidButton";

export type OutlineButtonProps = Omit<BaseSolidButtonProps<typeof ButtonVariants.OUTLINE>, "variant">;

export const OutlineButton = (props: OutlineButtonProps) => (
  <BaseSolidButton {...props} variant={ButtonVariants.OUTLINE} />
);
