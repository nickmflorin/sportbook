import React from "react";

import { type icons, type CSSDirection, CSSDirections } from "~/lib/ui";
import { type ButtonType, type ButtonTypes } from "~/components/buttons";
import { Icon } from "~/components/icons";

import { Button, type ButtonProps } from "./Button";

export type ContentButtonType = Exclude<ButtonType, typeof ButtonTypes.ACTION>;

type Loc = Exclude<CSSDirection, typeof CSSDirections.UP | typeof CSSDirections.DOWN>;

type ButtonContentProps = {
  readonly children: string | JSX.Element;
  readonly loading?: boolean;
  readonly icon?: icons.IconProp;
  readonly iconLocation?: Loc;
};

const ButtonContent = ({
  iconLocation = CSSDirections.LEFT,
  loading,
  icon,
  children,
}: ButtonContentProps): JSX.Element => (
  <div className="button__content">
    {iconLocation === CSSDirections.LEFT && (icon !== undefined || loading === true) && (
      <div className="button__icon-or-spinner-wrapper">
        <Icon icon={icon} loading={loading} />
      </div>
    )}
    <div className="button__sub-content">{children}</div>
    {iconLocation === CSSDirections.RIGHT && (icon !== undefined || loading === true) && (
      <div className="button__icon-or-spinner-wrapper">
        <Icon icon={icon} loading={loading} />
      </div>
    )}
  </div>
);

export type ContentButtonProps<V extends ContentButtonType = ContentButtonType> = ButtonProps<V> & ButtonContentProps;

export const ContentButton = <V extends ContentButtonType = ContentButtonType>({
  icon,
  iconLocation,
  loading,
  children,
  ...props
}: ContentButtonProps<V>) => (
  <Button {...props}>
    <ButtonContent loading={loading} iconLocation={iconLocation} icon={icon}>
      {children}
    </ButtonContent>
  </Button>
);
