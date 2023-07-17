import { ButtonVariants } from "../types";

import { BaseAlternateButton, type BaseAlternateButtonProps } from "./BaseAlternateButton";

export type PrimaryAlternateButtonProps = Omit<BaseAlternateButtonProps<typeof ButtonVariants.PRIMARY>, "variant">;

export const PrimaryAlternateButton = (props: PrimaryAlternateButtonProps) => (
  <BaseAlternateButton {...props} variant={ButtonVariants.PRIMARY} />
);
