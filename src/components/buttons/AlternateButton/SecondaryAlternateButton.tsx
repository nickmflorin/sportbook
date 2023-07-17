import { ButtonVariants } from "../types";

import { BaseAlternateButton, type BaseAlternateButtonProps } from "./BaseAlternateButton";

export type SecondaryAlternateButtonProps = Omit<BaseAlternateButtonProps<typeof ButtonVariants.SECONDARY>, "variant">;

export const SecondaryAlternateButton = (props: SecondaryAlternateButtonProps) => (
  <BaseAlternateButton {...props} variant={ButtonVariants.SECONDARY} />
);
