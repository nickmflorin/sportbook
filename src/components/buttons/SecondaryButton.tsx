import { SolidButton, type SolidButtonProps } from "./abstract";
import { ButtonSolidVariants } from "./types";

export type SecondaryButtonProps = Omit<SolidButtonProps<typeof ButtonSolidVariants.SECONDARY>, "variant">;

export const SecondaryButton = (props: SecondaryButtonProps) => (
  <SolidButton {...props} variant={ButtonSolidVariants.SECONDARY} />
);
