import { SolidButton, type SolidButtonProps } from "./abstract";
import { ButtonSolidVariants } from "./types";

export type PrimaryButtonProps = Omit<SolidButtonProps<typeof ButtonSolidVariants.PRIMARY>, "variant">;

export const PrimaryButton = (props: PrimaryButtonProps) => (
  <SolidButton {...props} variant={ButtonSolidVariants.PRIMARY} />
);
