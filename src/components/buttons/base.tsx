import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import React, { type ForwardedRef, useMemo } from "react";

import classNames from "classnames";
import { type Required, type Optional } from "utility-types";

import {
  type CSSDirection,
  CSSDirections,
  type ComponentProps,
  type HTMLElementProps,
  type Color,
  getColorClassName,
} from "~/lib/ui";
import {
  type ButtonType,
  type ButtonVariant,
  type ButtonSize,
  type ButtonCornerStyle,
  ButtonCornerStyles,
  ButtonSizes,
} from "~/components/buttons";
import { type IconProp, type IconSize, IconSizes } from "~/components/icons";
import { Icon } from "~/components/icons/Icon";
import { type FontWeight, type TypographySize } from "~/components/typography";

type BaseProps = ComponentProps & {
  readonly children: string | JSX.Element;
  readonly disabled?: boolean;
  readonly href?: NextLinkProps["href"];
};

export type BaseLinkProps = Required<BaseProps, "href"> & {
  readonly color?: Color;
  readonly fontWeight?: FontWeight;
  readonly fontSize?: TypographySize;
  readonly hoveredColor?: Color;
  readonly focusedColor?: Color;
};

export const getBaseLinkClassName = (props: Omit<BaseLinkProps, "children" | "href">) =>
  classNames(
    "link",
    props.color && `link--${getColorClassName("color", props.color)}`,
    props.focusedColor && `link--${getColorClassName("color", props.focusedColor, "focused")}`,
    props.hoveredColor && `link--${getColorClassName("color", props.hoveredColor, "hovered")}`,
    props.fontWeight && `link--font-weight-${props.fontWeight}`,
    props.fontSize && `link--font-size-${props.fontSize}`,
    /* For cases where the element is an HTMLAnchorElement, we will need to define the disabled class name such that the
       disabled behavior can be "mocked". */
    { disabled: props.disabled },
    props.className,
  );

export type BaseButtonLinkProps = BaseLinkProps &
  Pick<HTMLElementProps<"button">, "onClick" | "onFocus" | "onBlur" | "type" | "onFocusCapture" | "onBlurCapture">;

export type BaseButtonProps<T extends ButtonType, V extends ButtonVariant> = Optional<BaseProps, "href"> & {
  /**
   * The {@link ForwardedRef} that can be optionally passed through to the underlying {@link HTMLButtonElement}.
   *
   * It is important that this prop is exposed on the button element that is wrapped around "next/link"'s {@link Link}
   * component, and is necessary for them to work together properly.
   */
  readonly ref?: ForwardedRef<HTMLButtonElement>;
  readonly buttonType: T;
  readonly variant: V;
  readonly size?: ButtonSize;
  /**
   * Sets the element in a "locked" state, which is a state in which the non-visual characteristics of the "disabled"
   * state should be used, but the element should not be styled as if it is disabled.
   *
   * This prop should be used for cases where the click behavior of the element should be restricted, but we do not want
   * to treat the element, visually, as being disabled.  For instance, if the element is in a "loading" state, we do not
   * want it to look as if it is disabled - but we do not want to allow click events.
   */
  readonly locked?: boolean;
  readonly loading?: boolean;
  readonly cornerStyle?: ButtonCornerStyle;
} & Pick<HTMLElementProps<"button">, "onClick" | "onFocus" | "onBlur" | "type" | "onFocusCapture" | "onBlurCapture">;

export const getBaseButtonClassName = <T extends ButtonType, V extends ButtonVariant>(
  props: Required<Omit<BaseButtonProps<T, V>, "children">, "size" | "buttonType" | "cornerStyle" | "variant">,
) =>
  classNames(
    "button",
    `button--${props.variant}`,
    /* For cases where the element is an HTMLAnchorElement, we will need to define the disabled class name such that the
       disabled behavior can be "mocked". */
    { disabled: props.disabled },
    { "button--locked": props.locked === true || props.loading === true },
    { "button--loading": props.loading === true },
    `button--corner-style-${props.cornerStyle}`,
    `button--${props.buttonType}`,
    `button--${props.size}`,
    props.className,
  );

export const BaseButtonLink = ({
  onClick,
  disabled,
  href,
  fontWeight,
  children,
  color,
  ...props
}: BaseButtonLinkProps): JSX.Element => {
  /* The onClick should be overridden to prevent click behavior when the element is disabled just in case the "disabled"
     class is being used and the SASS style does not remove pointer event from the element. */
  const _onClick = useMemo(
    () => (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled !== true) {
        onClick?.(e);
      }
    },
    [onClick, disabled],
  );

  const btn = (
    <button
      type="button"
      {...props}
      className={getBaseLinkClassName({ ...props, disabled, fontWeight, color })}
      onClick={onClick !== undefined ? _onClick : undefined}
      disabled={disabled}
    >
      {children}
    </button>
  );
  if (disabled === true) {
    return btn;
  }
  return (
    <NextLink href={href} className="button-link-wrapper">
      <button
        type="button"
        {...props}
        className={getBaseLinkClassName({ ...props, disabled, fontWeight, color })}
        onClick={onClick !== undefined ? _onClick : undefined}
        disabled={disabled}
      >
        {children}
      </button>
    </NextLink>
  );
};

const _BaseButton = <T extends ButtonType, V extends ButtonVariant>({
  onClick,
  disabled,
  locked,
  loading,
  cornerStyle = ButtonCornerStyles.NORMAL,
  size = ButtonSizes.SM,
  buttonType,
  children,
  ...props
}: Omit<BaseButtonProps<T, V>, "href">): JSX.Element => {
  /* The onClick should be overridden to prevent click behavior when the element is disabled just in case the "disabled"
     class is being used and the SASS style does not remove pointer event from the element. */
  const _onClick = useMemo(
    () => (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled !== true && locked !== true) {
        onClick?.(e);
      }
    },
    [onClick, disabled, locked],
  );

  return (
    <button
      type="button"
      {...props}
      className={getBaseButtonClassName({ ...props, disabled, locked, loading, cornerStyle, buttonType, size })}
      onClick={onClick !== undefined ? _onClick : undefined}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const BaseButton = <T extends ButtonType, V extends ButtonVariant>({
  href,
  ...props
}: BaseButtonProps<T, V>): JSX.Element =>
  href !== undefined && props.disabled !== true ? (
    <NextLink href={href} className="button-link-wrapper">
      <_BaseButton {...props} />
    </NextLink>
  ) : (
    <_BaseButton {...props} />
  );

export const BaseLink = ({ disabled, children, color, fontWeight, ...props }: BaseLinkProps): JSX.Element => (
  <NextLink {...props} className={getBaseLinkClassName({ ...props, disabled, color, fontWeight })}>
    {children}
  </NextLink>
);

type Loc = Exclude<CSSDirection, typeof CSSDirections.UP | typeof CSSDirections.DOWN>;

type ButtonContentProps = {
  readonly component: "button";
  readonly children?: string | JSX.Element;
  readonly loading?: boolean;
  readonly icon?: IconProp | JSX.Element;
  readonly iconLocation?: Loc;
  readonly iconSize?: IconSize;
};

export type LinkContentProps = {
  readonly component: "link";
  readonly loading?: never;
  readonly children?: string | JSX.Element;
  readonly icon?: IconProp | JSX.Element;
  readonly iconLocation?: Loc;
  readonly iconSize?: IconSize;
};

type ButtonLinkContentProps = ButtonContentProps | LinkContentProps;

export const ButtonLinkContent = ({
  iconLocation = CSSDirections.LEFT,
  loading,
  component,
  iconSize = IconSizes.FILL,
  icon,
  children,
}: ButtonLinkContentProps): JSX.Element => {
  console.log({ icon });
  return (
    <div className={`${component}__content`}>
      {iconLocation === CSSDirections.LEFT && (icon !== undefined || loading === true) && (
        <div className={`${component}__icon-wrapper`}>
          <Icon size={iconSize} icon={icon} loading={loading} axis="vertical" />
        </div>
      )}
      <div className={`${component}__sub-content`}>{children}</div>
      {iconLocation === CSSDirections.RIGHT && (icon !== undefined || loading === true) && (
        <div className={`${component}__icon-wrapper`}>
          <Icon size={iconSize} icon={icon} loading={loading} axis="vertical" />
        </div>
      )}
    </div>
  );
};

export type ButtonProps<T extends ButtonType, V extends ButtonVariant> = Optional<BaseButtonProps<T, V>, "children"> &
  Omit<ButtonContentProps, "component" | "children"> & {
    readonly content?: JSX.Element;
    readonly children?: string | JSX.Element;
  };

export const Button = <T extends ButtonType, V extends ButtonVariant>({
  icon,
  iconLocation,
  loading,
  children,
  content,
  iconSize,
  ...props
}: ButtonProps<T, V>) => (
  <BaseButton {...props}>
    {content !== undefined ? (
      content
    ) : (
      <ButtonLinkContent
        component="button"
        iconSize={iconSize}
        loading={loading}
        iconLocation={iconLocation}
        icon={icon}
      >
        {children}
      </ButtonLinkContent>
    )}
  </BaseButton>
);
