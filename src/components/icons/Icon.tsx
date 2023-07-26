import React from "react";

import classNames from "classnames";
import { type Optional } from "utility-types";

import { getColorClassName } from "~/lib/ui";
import { SizeAxes, SizeContains } from "~/lib/ui/types";

import {
  IconSizes,
  type IconComponentProps,
  type IconProps,
  type IconElement,
  isIconElement,
  type IconDefinitionParams,
  type EmbeddedIconComponentProps,
  type BasicIconProp,
  type BasicIconComponentProps,
  type IconProp,
  isBasicIconComponentProps,
  type GetNativeIconClassNameParams,
  getNativeIconClassName,
} from "./types";

export type SpinnerProps = Omit<
  IconComponentProps,
  | keyof IconDefinitionParams
  | "spin"
  | "icon"
  | "contain"
  | "loading"
  | "spinnerColor"
  | "hoveredColor"
  | "focusedColor"
> & {
  readonly loading: boolean;
};

export const Spinner = ({ color = "blue.6", loading, ...props }: SpinnerProps): JSX.Element =>
  loading === true ? (
    <IconComponent
      {...props}
      color={color}
      className={classNames("spinner", props.className)}
      spin={true}
      loading={false}
      name="circle-notch"
      contain={SizeContains.SQUARE}
    />
  ) : (
    <></>
  );

const IconComponent = ({
  loading = false,
  spinnerColor = "blue",
  hoveredColor,
  focusedColor,
  spin,
  size = IconSizes.MD,
  axis = SizeAxes.VERTICAL,
  contain = SizeContains.FIT,
  color,
  icon,
  name,
  iconStyle,
  family,
  className,
  style,
}: IconComponentProps) => {
  if (loading === true || (loading === false && !icon && !name)) {
    return <Spinner className={className} style={style} loading={true} color={spinnerColor} size={size} />;
  } else if (icon !== undefined || name !== undefined) {
    /* The "@fortawesome/react-fontawesome" package's <FontAwesomeIcon /> component does not work properly with the
       FontAwesome Icon Kit.  We use the Icon Kit because it dynamically loads just the icons that we need from a CDN -
       which is much faster and easier to maintain.  However, it does not work with React - only CSS classes.  Since
       the <FontAwesomeIcon /> component simply renders an SVG element, we can mimic its behavior by rendering an SVG
       inside of an <i> element, where the <i> element is given the Font Awesome class names that are defined in the
       content loaded from the CDN (these class names are generated via 'getNativeIconClassName' below). */
    return (
      <i
        style={style}
        className={classNames(
          getNativeIconClassName({ icon, name, iconStyle, family } as GetNativeIconClassNameParams),
          { "fa-spin": spin },
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
          className,
        )}
      />
    );
  } else {
    return <></>;
  }
};

/**
 * Merges the provided props, {@link Omit<IconProps, "icon">}, into a previously created icon element,
 * {@link IconElement}, such that an icon element can be altered in place by components who accept an `icon` as a
 * prop, {@link IconProp}.
 */
export const mergeIconElementWithProps = (
  element: IconElement,
  { axis, size, style, className, ...props }: Omit<IconProps, "icon" | keyof IconDefinitionParams>,
): IconElement => {
  const mergedProps: Omit<IconProps, "icon" | keyof IconDefinitionParams> = {
    ...props,
    axis: axis === undefined ? element.props.axis : axis,
    size: size === undefined ? element.props.size : size,
    style: { ...element.props.style, ...style },
    className: classNames(element.props.className, className),
  };
  /* We only have to force coerce the return type here because the `type` of the element is not defined generically with
     the cloneElement - but since we are cloning an element that we already ensured is of type IconElement, this
     coercion is safe. */
  return React.cloneElement<IconProps>(element, mergedProps) as IconElement;
};

const _Icon = (props: IconProps): JSX.Element => {
  if (isBasicIconComponentProps<IconProps, IconProp>(props)) {
    const { icon, ...rest } = props;
    if (isIconElement(icon)) {
      return mergeIconElementWithProps(icon, props);
    }
    return <IconComponent icon={icon} {...rest} />;
  }
  return <IconComponent {...props} />;
};

type OptionalIconProps =
  | Optional<EmbeddedIconComponentProps, "name">
  | Optional<BasicIconComponentProps<BasicIconProp | IconElement>, "icon">;

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
export const Icon = ({ loading, ...props }: OptionalIconProps): JSX.Element => {
  if (props.icon !== undefined || props.name !== undefined) {
    return <_Icon loading={loading} {...(props as IconProps)} />;
  } else if (loading !== undefined) {
    return <Spinner loading={loading} {...props} />;
  }
  return <></>;
};
