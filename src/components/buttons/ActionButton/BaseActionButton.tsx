import dynamic from "next/dynamic";

import { ButtonTypes, type ButtonVariant } from "~/components/buttons";
import { IconSizes, type IconProp } from "~/components/icons";

const Icon = dynamic(() => import("~/components/icons/Icon"));

import { Button, type ButtonProps } from "../Button";

export type BaseActionButtonProps<V extends ButtonVariant = ButtonVariant> = Omit<
  ButtonProps<"action", V>,
  "children" | "buttonType"
> & {
  readonly icon: IconProp;
};

export const BaseActionButton = <V extends ButtonVariant = ButtonVariant>({
  icon,
  variant,
  ...props
}: BaseActionButtonProps<V>) => (
  <Button
    {...props}
    buttonType={ButtonTypes.ACTION}
    variant={variant}
    content={<Icon icon={icon} loading={props.loading} size={IconSizes.FILL} />}
  />
);
