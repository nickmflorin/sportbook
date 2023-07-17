import Link, { type LinkProps } from "next/link";
import React, { type ForwardedRef, useMemo } from "react";

import classNames from "classnames";
import { type Required } from "utility-types";

import { type ComponentProps, type HTMLElementProps } from "~/lib/ui";
import {
  type ButtonType,
  type ButtonSize,
  type ButtonCornerStyle,
  ButtonCornerStyles,
  ButtonSizes,
} from "~/components/buttons";

export type ButtonProps<V extends ButtonType = ButtonType> = ComponentProps & {
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
  readonly href?: LinkProps["href"];
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

export const getButtonClassName = <V extends ButtonType = ButtonType>(
  props: Required<Omit<ButtonProps<V>, "children">, "size" | "buttonType" | "cornerStyle"> & {
    readonly disabled?: boolean;
  },
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

const _Button = <V extends ButtonType = ButtonType>({
  onClick,
  disabled,
  locked,
  loading,
  cornerStyle = ButtonCornerStyles.NORMAL,
  size = ButtonSizes.SM,
  buttonType,
  children,
  ...props
}: Omit<ButtonProps<V>, "href">): JSX.Element => {
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
      className={getButtonClassName({ ...props, disabled, locked, loading, cornerStyle, buttonType, size })}
      onClick={_onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const Button = <V extends ButtonType = ButtonType>({ href, ...props }: ButtonProps<V>): JSX.Element =>
  href !== undefined ? (
    <Link href={href} className="link">
      <_Button {...props} />
    </Link>
  ) : (
    <_Button {...props} />
  );
