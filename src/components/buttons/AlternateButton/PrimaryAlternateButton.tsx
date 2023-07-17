import { BaseAlternateButton, type BaseAlternateButtonProps } from "./BaseAlternateButton";
import { ButtonVariants } from "../types";

export type PrimaryAlternateButtonProps = Omit<BaseAlternateButtonProps<typeof ButtonVariants.PRIMARY>, "variant">;

export const PrimaryAlternateButton = (props: PrimaryAlternateButtonProps) => (
  <BaseAlternateButton {...props} variant={ButtonVariants.PRIMARY} />
);
