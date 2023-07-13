import React from "react";

import classNames from "classnames";

import { type icons, type CSSDirection, CSSDirections } from "~/lib/ui";
import { type ButtonType, type ButtonTypes } from "~/components/buttons";
import { IconOrSpinner } from "~/components/display/icons";

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
    {iconLocation === CSSDirections.LEFT && (icon || loading) && (
      <div className="button__icon-or-spinner-wrapper">
        <IconOrSpinner icon={icon} loading={loading} />
      </div>
    )}
    {/* In cases where the text characteristics are altered on user interaction events (such as making the text bold
        when the button or anchor is hovered), the width of the text in the button or anchor can change - which in turn
        will cause the width of the overall button or anchor to change.  We can avoid this in CSS by presetting the
        width of the text based on the largest width it would have for any interaction event.  To do that, we need an
        HTML reference to the text value, set as the `title` attribute on the element. */}
    <div
      className={classNames("button__sub-content", {
        "button__sub-content--string": typeof children === "string",
      })}
      title={typeof children === "string" ? children : undefined}
    >
      {children}
    </div>
    {iconLocation === CSSDirections.RIGHT && (icon || loading) && (
      <div className="button__icon-or-spinner-wrapper">
        <IconOrSpinner icon={icon} loading={loading} />
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
