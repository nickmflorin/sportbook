import classNames from "classnames";

import { icons } from "~/lib/ui";
import { ButtonTypes, type ButtonVariant } from "~/components/buttons";
import { Icon } from "~/components/icons";

import { Button, type ButtonProps } from "../abstract/Button";

export type BaseActionButtonProps<V extends ButtonVariant = ButtonVariant> = Omit<
  ButtonProps,
  "children" | "buttonType"
> & {
  readonly icon: icons.IconProp;
  readonly variant: V;
};

export const BaseActionButton = <V extends ButtonVariant = ButtonVariant>({
  icon,
  variant,
  ...props
}: BaseActionButtonProps<V>) => (
  <Button
    {...props}
    buttonType={ButtonTypes.ACTION}
    className={classNames(`button--action--${variant}`, props.className)}
  >
    <Icon icon={icon} loading={props.loading} size={icons.IconSizes.FILL} />
  </Button>
);
