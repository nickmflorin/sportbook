import classNames from "classnames";

import { icons } from "~/lib/ui";
import { ButtonTypes, type ButtonActionVariant } from "~/components/buttons";
import { Icon } from "~/components/display/icons";

import { Button, type ButtonProps } from "./Button";

export type ActionButtonProps<V extends ButtonActionVariant = ButtonActionVariant> = Omit<
  ButtonProps,
  "children" | "buttonType"
> & {
  readonly icon: icons.IconProp;
  readonly variant: V;
};

export const ActionButton = <V extends ButtonActionVariant = ButtonActionVariant>({
  icon,
  variant,
  ...props
}: ActionButtonProps<V>) => (
  <Button
    {...props}
    buttonType={ButtonTypes.ACTION}
    className={classNames(`button--action--${variant}`, props.className)}
  >
    <Icon icon={icon} loading={props.loading} size={icons.IconSizes.FILL} />
  </Button>
);
