import { BaseAlternateButton, type BaseAlternateButtonProps } from "./BaseAlternateButton";
import { ButtonVariants } from "../types";

export type SecondaryAlternateButtonProps = Omit<BaseAlternateButtonProps<typeof ButtonVariants.SECONDARY>, "variant">;

export const SecondaryAlternateButton = (props: SecondaryAlternateButtonProps) => (
  <BaseAlternateButton {...props} variant={ButtonVariants.SECONDARY} />
);
