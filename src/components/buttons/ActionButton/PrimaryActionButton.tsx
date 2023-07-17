import { ButtonVariants } from "~/components/buttons";

import { BaseActionButton, type BaseActionButtonProps } from "./BaseActionButton";

export type PrimaryActionButtonProps = Omit<BaseActionButtonProps<typeof ButtonVariants.PRIMARY>, "variant">;

export const PrimaryActionButton = (props: PrimaryActionButtonProps) => (
  <BaseActionButton {...props} variant={ButtonVariants.PRIMARY} />
);
