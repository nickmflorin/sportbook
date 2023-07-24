"use client";
import React, { forwardRef, type ForwardedRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { type Optional } from "utility-types";

import { getColorClassName, icons } from "~/lib/ui";
import { SizeAxes, SizeContains } from "~/lib/ui/types";

export type SpinnerProps = Omit<icons.IconComponentProps, "spin" | "icon" | "contain" | "loading"> & {
  readonly loading: boolean;
};

export const Spinner = ({ color = "blue.6", loading, ...props }: SpinnerProps): JSX.Element =>
  loading === true ? (
    <_IconComponent
      {...props}
      color={color}
      className={classNames("spinner", props.className)}
      spin={true}
      loading={false}
      icon={icons.IconNames.CIRCLE_NOTCH}
      contain={SizeContains.SQUARE}
    />
  ) : (
    <></>
  );

function _IconComponent({
  ref,
  loading = false,
  spinnerColor = "blue",
  hoveredColor,
  focusedColor,
  icon,
  spin,
  size = icons.IconSizes.MD,
  axis = SizeAxes.VERTICAL,
  contain = SizeContains.FIT,
  color,
  ...props
}: icons.IconComponentProps & { readonly ref?: ForwardedRef<SVGSVGElement> }) {
  if (loading === true) {
    return <Spinner {...props} loading={true} color={spinnerColor} size={size} />;
  }
  return (
    <FontAwesomeIcon
      {...props}
      className={classNames(
        "icon",
        `icon--contain-${contain}`,
        `icon--size-${size}`,
        `icon--axis-${axis}`,
        color &&
          getColorClassName("color", color, {
            hovered: hoveredColor === undefined ? focusedColor : hoveredColor,
            focused: focusedColor === undefined ? hoveredColor : undefined,
          }),
        `icon--size-${size}`,
        props.className,
      )}
      spin={spin}
      ref={ref}
      icon={icons.getNativeIcon(icon)}
    />
  );
}

const IconComponent = forwardRef((props: icons.IconComponentProps, ref: ForwardedRef<SVGSVGElement>) => (
  <_IconComponent {...props} ref={ref} />
)) as typeof _IconComponent;

const _Icon = forwardRef(function Icon({ icon, ...props }: icons.IconProps, ref: ForwardedRef<SVGSVGElement>) {
  if (icons.isIconElement(icon)) {
    return icons.mergeIconElementWithProps(icon, props);
  }
  return <IconComponent {...props} ref={ref} icon={icon} />;
});

/**
 * Renders a FontAwesome icon based on the provided `icon` prop.
 *
 * This component represents the primary definition for an icon in the application and the above <IconComponent />
 * should not be used outside of this file.
 *
 * This <Icon /> component allows the `icon` prop to be provided as either an element, {@link IconElement}, or a
 * name/prefix definition, {@link BasicIconProp} (e.g. ["far", "slack"]).  This allows components that accept an `icon`
 * prop to accept it either as an `<Icon />` rendered element, {@link IconElement}, or a prefix/name combination,
 * {@link BasicIconProp}, while still rendering the provided prop inside of an `<Icon />` element it defines:
 *
 * type ButtonProps = { ..., icon: IconProp };
 * const Button = (props: ButtonProps) => {
 *   ...
 *   return (
 *     <div className="button">
 *       <Icon icon={props.icon} className={"button-icon"} />
 *       <div className="button-text">{props.children}</div>
 *     </div>
 *   )
 * }
 *
 * This is important because it allows an `icon` prop to be used and passed between components in a way that does not
 * introduce logical concerns if a component further up in the tree specifies other attributes on the icon and the
 * component on the bottom of the tree still needs to render it.
 *
 * @example
 * const previousIcon = <Icon className={"icon--previous"} icon={"square"} />;
 * const finalIcon = <Icon icon={previousIcon} className={"icon--button"} />;
 *
 * ReactDOM.render(finalIcon, document.getElementById("#root"));
 * "<svg class="icon--previous icon--button">...</svg>"
 */
export const Icon = ({ icon, loading, ...props }: Optional<icons.IconProps, "icon">): JSX.Element =>
  icon !== undefined ? (
    <_Icon {...props} loading={loading} icon={icon} />
  ) : loading !== undefined ? (
    <Spinner loading={loading} {...props} />
  ) : (
    <></>
  );
