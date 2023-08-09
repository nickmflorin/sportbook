import React from "react";

import classNames from "classnames";
import { type Optional } from "utility-types";

import { type ClassName, getColorClassName, SizeContains, replaceOrAddClassName } from "~/lib/ui";

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

const DynamicIconClassNamePropNames = ["contain", "size", "axis", "color", "focusedColor", "hoveredColor"] as const;

type DynamicIconClassNamePropName = (typeof DynamicIconClassNamePropNames)[number];

type DynamicIconClassNameProps = Pick<IconProps, DynamicIconClassNamePropName>;

type DynamicIconClassNameConfig<N extends DynamicIconClassNamePropName> = {
  readonly create: (dynamic: DynamicIconClassNameProps[N]) => string | null;
  readonly predicate: (className: string) => boolean;
};

const DynamicClassNameConfig: { [key in DynamicIconClassNamePropName]: DynamicIconClassNameConfig<key> } = {
  contain: {
    create: v => (v !== undefined ? `icon--contain-${v}` : null),
    predicate: className => className.startsWith("icon--contain-"),
  },
  size: {
    create: v => (v !== undefined ? `icon--size-${v}` : null),
    predicate: className => className.startsWith("icon--size-"),
  },
  axis: {
    create: v => (v !== undefined ? `icon--axis-${v}` : null),
    predicate: className => className.startsWith("icon--axis-"),
  },
  color: {
    create: v => (v !== undefined ? getColorClassName("color", v) : null),
    predicate: className => className.startsWith("color-"),
  },
  hoveredColor: {
    create: v => (v !== undefined ? getColorClassName("color", v, "hovered") : null),
    predicate: className => className.startsWith("color-") && className.endsWith("-hovered"),
  },
  focusedColor: {
    create: v => (v !== undefined ? getColorClassName("color", v, "focused") : null),
    predicate: className => className.startsWith("color-") && className.endsWith("-focused"),
  },
};

const getDynamicIconClassName = (props: Pick<IconProps, DynamicIconClassNamePropName>): string =>
  [...DynamicIconClassNamePropNames].reduce(<N extends DynamicIconClassNamePropName>(prev: string, curr: N) => {
    const propName = curr as N;
    const config = DynamicClassNameConfig[propName];
    const v = props[propName];
    const className = config.create(v);
    return className !== null ? `${prev} ${className}` : prev;
  }, "");

const getIconClassName = ({ icon, name, iconStyle, family, ...props }: IconProps): string =>
  classNames(
    "icon",
    getNativeIconClassName({ icon, name, iconStyle, family } as GetNativeIconClassNameParams),
    getDynamicIconClassName(props),
    { "fa-spin": props.spin },
    props.className,
  );

const updateIconClassName = (existing: ClassName, props: DynamicIconClassNameProps): ClassName =>
  [...DynamicIconClassNamePropNames].reduce(<N extends DynamicIconClassNamePropName>(prev: ClassName, curr: N) => {
    const propName = curr as N;
    const config = DynamicClassNameConfig[propName];
    const v = props[propName];
    if (v !== undefined) {
      return replaceOrAddClassName({ current: prev, predicate: config.predicate, insert: config.create(v) });
    }
    return prev;
  }, existing);

const IconComponent = ({
  loading = false,
  spinnerColor = "blue",
  size = IconSizes.MD,
  axis,
  contain,
  style,
  ...props
}: IconComponentProps) => {
  if (loading === true || (loading === false && !props.icon && !props.name)) {
    return <Spinner className={props.className} style={style} loading={true} color={spinnerColor} size={size} />;
  } else if (props.icon !== undefined || props.name !== undefined) {
    /* The "@fortawesome/react-fontawesome" package's <FontAwesomeIcon /> component does not work properly with the
       FontAwesome Icon Kit.  We use the Icon Kit because it dynamically loads just the icons that we need from a CDN -
       which is much faster and easier to maintain.  However, it does not work with React - only CSS classes.  Since
       the <FontAwesomeIcon /> component simply renders an SVG element, we can mimic its behavior by rendering an SVG
       inside of an <i> element, where the <i> element is given the Font Awesome class names that are defined in the
       content loaded from the CDN (these class names are generated via 'getNativeIconClassName' below). */
    return <i style={style} className={getIconClassName({ ...props, size, axis, contain })} />;
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
  {
    axis,
    size,
    style,
    className,
    contain,
    color,
    focusedColor,
    hoveredColor,
  }: Omit<IconProps, "icon" | "loading" | "spinnerColor" | "spin" | keyof IconDefinitionParams>,
): IconElement => {
  const mergedProps: Omit<IconProps, "icon" | keyof IconDefinitionParams> = {
    style: { ...element.props.style, ...style },
    className: classNames(
      updateIconClassName(element.props.className, { axis, size, contain, color, focusedColor, hoveredColor }),
      className,
    ),
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
