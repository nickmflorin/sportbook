import classNames from "classnames";

import { ButtonTypes, type ButtonVariant } from "~/components/buttons";
import { IconSizes, type IconProp } from "~/components/icons";
import { Icon } from "~/components/icons/Icon";

import { BaseButton, type BaseButtonProps } from "../base";

export type BaseActionButtonProps<V extends ButtonVariant = ButtonVariant> = Omit<
  BaseButtonProps,
  "children" | "buttonType"
> & {
  readonly icon: IconProp;
  readonly variant: V;
};

export const BaseActionButton = <V extends ButtonVariant = ButtonVariant>({
  icon,
  variant,
  ...props
}: BaseActionButtonProps<V>) => (
  <BaseButton
    {...props}
    buttonType={ButtonTypes.ACTION}
    className={classNames(`button--action--${variant}`, props.className)}
  >
    <Icon icon={icon} loading={props.loading} size={IconSizes.FILL} />
  </BaseButton>
);
