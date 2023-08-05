import { ButtonVariants } from "~/components/buttons";

import { BaseActionButton, type BaseActionButtonProps } from "./BaseActionButton";

export type OutlineActionButtonProps = Omit<BaseActionButtonProps<typeof ButtonVariants.OUTLINE>, "variant">;

export const OutlineActionButton = (props: OutlineActionButtonProps) => (
  <BaseActionButton {...props} variant={ButtonVariants.OUTLINE} />
);
