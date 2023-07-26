import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import React, { type ForwardedRef, useMemo } from "react";

import classNames from "classnames";
import { type Required } from "utility-types";

import { type CSSDirection, CSSDirections, type ComponentProps, type HTMLElementProps } from "~/lib/ui";
import {
  type ButtonTypes,
  type ButtonType,
  type ButtonSize,
  type ButtonCornerStyle,
  ButtonCornerStyles,
  ButtonSizes,
} from "~/components/buttons";
import { type IconProp } from "~/components/icons";
import { Icon } from "~/components/icons/Icon";

export type BaseLinkProps = ComponentProps & {
  readonly children: string | JSX.Element;
  readonly href: NextLinkProps["href"];
  readonly disabled?: boolean;
};

export const getBaseLinkClassName = (props: Omit<BaseLinkProps, "children">) =>
  classNames(
    "link",
    /* For cases where the element is an HTMLAnchorElement, we will need to define the disabled class name such that the
       disabled behavior can be "mocked". */
    { disabled: props.disabled },
    props.className,
  );

export type BaseButtonProps<V extends ButtonType = ButtonType> = ComponentProps & {
  /**
   * The {@link ForwardedRef} that can be optionally passed through to the underlying {@link HTMLButtonElement}.
   *
   * It is important that this prop is exposed on the button element that is wrapped around "next/link"'s {@link Link}
   * component, and is necessary for them to work together properly.
   */
  readonly ref?: ForwardedRef<HTMLButtonElement>;
  readonly children: string | JSX.Element;
  readonly buttonType: V;
  readonly size?: ButtonSize;
  readonly href?: NextLinkProps["href"];
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
} & Pick<HTMLElementProps<"button">, "onClick" | "onFocus" | "onBlur" | "disabled" | "type">;

export const getBaseButtonClassName = <V extends ButtonType = ButtonType>(
  props: Required<Omit<BaseButtonProps<V>, "children">, "size" | "buttonType" | "cornerStyle">,
) =>
  classNames(
    "button",
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

const _BaseButton = <V extends ButtonType = ButtonType>({
  onClick,
  disabled,
  locked,
  loading,
  cornerStyle = ButtonCornerStyles.NORMAL,
  size = ButtonSizes.SM,
  buttonType,
  children,
  ...props
}: Omit<BaseButtonProps<V>, "href">): JSX.Element => {
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

export const BaseButton = <V extends ButtonType = ButtonType>({ href, ...props }: BaseButtonProps<V>): JSX.Element =>
  href !== undefined ? (
    <NextLink href={href} className="button-link-wrapper">
      <_BaseButton {...props} />
    </NextLink>
  ) : (
    <_BaseButton {...props} />
  );

export const BaseLink = ({ disabled, children, ...props }: BaseLinkProps): JSX.Element => (
  <NextLink {...props} className={getBaseLinkClassName({ ...props, disabled })}>
    {children}
  </NextLink>
);

export type ContentButtonType = Exclude<ButtonType, typeof ButtonTypes.ACTION>;

type Loc = Exclude<CSSDirection, typeof CSSDirections.UP | typeof CSSDirections.DOWN>;

type ButtonContentProps = {
  readonly component: "button";
  readonly children: string | JSX.Element;
  readonly loading?: boolean;
  readonly icon?: IconProp;
  readonly iconLocation?: Loc;
};

type LinkContentProps = {
  readonly component: "link";
  readonly loading?: never;
  readonly children: string | JSX.Element;
  readonly icon?: IconProp;
  readonly iconLocation?: Loc;
};

type ButtonLinkContentProps = ButtonContentProps | LinkContentProps;

const ButtonLinkContent = ({
  iconLocation = CSSDirections.LEFT,
  loading,
  component,
  icon,
  children,
}: ButtonLinkContentProps): JSX.Element => (
  <div className={`${component}__content`}>
    {iconLocation === CSSDirections.LEFT && (icon !== undefined || loading === true) && (
      <div className={`${component}__icon-wrapper`}>
        <Icon icon={icon} loading={loading} />
      </div>
    )}
    <div className={`${component}__sub-content`}>{children}</div>
    {iconLocation === CSSDirections.RIGHT && (icon !== undefined || loading === true) && (
      <div className={`${component}__icon-wrapper`}>
        <Icon icon={icon} loading={loading} />
      </div>
    )}
  </div>
);

export type ContentButtonProps<V extends ContentButtonType = ContentButtonType> = BaseButtonProps<V> &
  Omit<ButtonContentProps, "component">;

export const ContentButton = <V extends ContentButtonType = ContentButtonType>({
  icon,
  iconLocation,
  loading,
  children,
  ...props
}: ContentButtonProps<V>) => (
  <BaseButton {...props}>
    <ButtonLinkContent component="button" loading={loading} iconLocation={iconLocation} icon={icon}>
      {children}
    </ButtonLinkContent>
  </BaseButton>
);

export type ContentLinkProps = BaseLinkProps & Omit<LinkContentProps, "component">;

export const ContentLink = ({ icon, iconLocation, children, ...props }: ContentLinkProps) => (
  <BaseLink {...props}>
    <ButtonLinkContent component="link" iconLocation={iconLocation} icon={icon}>
      {children}
    </ButtonLinkContent>
  </BaseLink>
);
