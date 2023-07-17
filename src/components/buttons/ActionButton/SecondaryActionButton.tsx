import { ButtonVariants } from "~/components/buttons";

import { BaseActionButton, type BaseActionButtonProps } from "./BaseActionButton";

export type SecondaryActionButtonProps = Omit<BaseActionButtonProps<typeof ButtonVariants.SECONDARY>, "variant">;

export const SecondaryActionButton = (props: SecondaryActionButtonProps) => (
  <BaseActionButton {...props} variant={ButtonVariants.SECONDARY} />
);
