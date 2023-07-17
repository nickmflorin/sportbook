import { ButtonVariants } from "~/components/buttons";

import { BaseActionButton, type BaseActionButtonProps } from "./BaseActionButton";

export type DangerActionButtonProps = Omit<BaseActionButtonProps<typeof ButtonVariants.DANGER>, "variant">;

export const DangerActionButton = (props: DangerActionButtonProps) => (
  <BaseActionButton {...props} variant={ButtonVariants.DANGER} />
);
