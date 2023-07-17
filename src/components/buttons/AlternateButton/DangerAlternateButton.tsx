import { BaseAlternateButton, type BaseAlternateButtonProps } from "./BaseAlternateButton";
import { ButtonVariants } from "../types";

export type DangerAlternateButtonProps = Omit<BaseAlternateButtonProps<typeof ButtonVariants.DANGER>, "variant">;

export const DangerAlternateButton = (props: DangerAlternateButtonProps) => (
  <BaseAlternateButton {...props} variant={ButtonVariants.DANGER} />
);
