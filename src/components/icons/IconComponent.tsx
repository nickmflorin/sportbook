import React from "react";

import classNames from "classnames";

import { getColorClassName, type ComponentProps, type Color, type SizeContain, type SizeAxis } from "~/lib/ui";

import { IconSizes, type IconSize, type IconProp, type IconDefinitionParams } from "./types";
import {
  isIconDefinitionParams,
  getIconFamilyClassName,
  getIconNameClassName,
  getIconPrefixClassName,
  getIconStyleClassName,
} from "./util";

type _BaseIconProps = ComponentProps &
  /* eslint-disable-next-line @typescript-eslint/consistent-type-imports */
  Pick<import("@fortawesome/react-fontawesome").FontAwesomeIconProps, "spin"> & {
    /**
     * Whether or not the Icon should be rendered as a "loading" spinner.  Useful in cases where a component contains
     * an Icon but needs to replace it with a loading indicator when in a loading state.
     */
    readonly loading?: boolean;
    readonly color?: Color;
    readonly hoveredColor?: Color;
    readonly focusedColor?: Color;
    readonly spinnerColor?: Color;
    /**
     * A string, "fit" or "square", that defines whether or not the `svg` element should fit snuggly around the inner
     * `path` element of the Icon or SVG ("fit") or the `svg` element should have a 1-1 aspect ratio, with its inner
     * `path` element being centered in the containing `svg` ("square").
     *
     * Default: "square"
     */
    readonly contain?: SizeContain;
    readonly size?: IconSize;
    /**
     * The axis {@link Exclude<SizeAxis, "both">} that the Icon should be sized in based on the provided `size` prop.
     * An Icon must maintain its aspect-ratio, so it cannot size in both directions.
     *
     * Default: "vertical";
     */
    readonly axis?: SizeAxis;
  };

/**
 * The props that the component responsible for rendering the Icon component.
 */
export type BasicIconComponentProps = Omit<_BaseIconProps, "loading"> & {
  [key in keyof IconDefinitionParams]?: never;
} & {
  readonly icon: IconProp;
};

export type EmbeddedIconComponentProps = Omit<_BaseIconProps, "loading"> &
  IconDefinitionParams & {
    readonly icon?: never;
  };

export type IconComponentProps = BasicIconComponentProps | EmbeddedIconComponentProps;

export type GetNativeIconClassNameParams =
  | Pick<BasicIconComponentProps, "icon">
  | Pick<EmbeddedIconComponentProps, keyof IconDefinitionParams>;

type _GetNativeIconClassNameParams<T> =
  | (T & Pick<BasicIconComponentProps, "icon">)
  | (T & Pick<EmbeddedIconComponentProps, keyof IconDefinitionParams>);

export const isBasicIconComponentProps = <T,>(
  params: _GetNativeIconClassNameParams<T>,
): params is T & Pick<BasicIconComponentProps, "icon"> =>
  (params as T & Pick<BasicIconComponentProps, "icon">).icon !== undefined;

export const getNativeIconName = <T,>(params: _GetNativeIconClassNameParams<T>): string => {
  if (isBasicIconComponentProps(params)) {
    if (isIconDefinitionParams(params.icon)) {
      return params.icon.name;
    }
    return params.icon.iconName;
  }
  return params.name;
};

/**
 * Returns the appropriate Font Awesome native class names for the <i> element that is rendered by the <Icon />
 * component, based on the provided icon information.
 *
 * The "@fortawesome/react-fontawesome" package's <FontAwesomeIcon /> component does not work properly with the
 * FontAwesome Icon Kit.  We use the Icon Kit because it dynamically loads just the icons that we need from a CDN -
 * which is much faster and easier to maintain.  However, it does not work with React - only CSS classes.  This method
 * is designed to return the appropriate class name for the <i> element, based on the provided icon information, so
 * that the class names defined in the stylesheets loaded from the CDN can properly render the icon.
 *
 * @param {_GetNativeIconClassNameParams<T>} params
 *   Parameters that include information about the specific icon being rendered.  These can be provided as the native
 *   FontAwesome {@link IconDefinition} or the {@link IconParams} - either provided under the 'icon' param or as
 *   separate, individual parameters (this is done for purposes of flexibility in Icon component itself).
 *
 * @returns {string}
 *
 * @example
 * getNativeIconClassName({ icon: { family: "sharp", name: "house", style: "regular" } })
 *
 * @example
 * getNativeIconClassName({ family: "sharp", name: "house", style: "regular" })
 *
 */
export const getNativeIconClassName = <T,>(params: _GetNativeIconClassNameParams<T>): string => {
  if (isBasicIconComponentProps(params)) {
    if (isIconDefinitionParams(params.icon)) {
      return classNames(
        getIconFamilyClassName(params.icon.family),
        getIconStyleClassName(params.icon.iconStyle),
        getIconNameClassName(params.icon.name),
      );
    }
    return classNames(getIconPrefixClassName(params.icon.prefix), getIconNameClassName(params.icon.iconName));
  }
  const { iconStyle, name, family } = params;
  return classNames(getIconFamilyClassName(family), getIconStyleClassName(iconStyle), getIconNameClassName(name));
};

const DynamicIconClassNamePropNames = ["contain", "size", "axis", "color", "focusedColor", "hoveredColor"] as const;

type DynamicIconClassNamePropName = (typeof DynamicIconClassNamePropNames)[number];

type DynamicIconClassNameProps = Pick<IconComponentProps, DynamicIconClassNamePropName>;

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

const getDynamicIconClassName = (props: Pick<IconComponentProps, DynamicIconClassNamePropName>): string =>
  [...DynamicIconClassNamePropNames].reduce(<N extends DynamicIconClassNamePropName>(prev: string, curr: N) => {
    const propName = curr as N;
    const config = DynamicClassNameConfig[propName];
    const v = props[propName];
    const className = config.create(v);
    return className !== null ? `${prev} ${className}` : prev;
  }, "");

const getIconClassName = ({ icon, name, iconStyle, family, ...props }: IconComponentProps): string =>
  classNames(
    "icon",
    getNativeIconClassName({ icon, name, iconStyle, family } as GetNativeIconClassNameParams),
    getDynamicIconClassName(props),
    { "fa-spin": props.spin },
    props.className,
  );

export const IconComponent = ({
  /* loading = false,
     spinnerColor = "blue", */
  size = IconSizes.MD,
  axis,
  contain,
  style,
  ...props
}: IconComponentProps) => {
  if (props.icon !== undefined || props.name !== undefined) {
    /* The "@fortawesome/react-fontawesome" package's <FontAwesomeIcon /> component does not work properly with the
       FontAwesome Icon Kit.  We use the Icon Kit because it dynamically loads just the icons that we need from a CDN -
       which is much faster and easier to maintain.  However, it does not work with React - only CSS classes.  Since
       the <FontAwesomeIcon /> component simply renders an SVG element, we can mimic its behavior by rendering an SVG
       inside of an <i> element, where the <i> element is given the Font Awesome class names that are defined in the
       content loaded from the CDN (these class names are generated via 'getNativeIconClassName' below). */
    return (
      <i
        style={style}
        className={getIconClassName({ ...props, size, axis, contain })}
        data-icon={getNativeIconName(props)}
      />
    );
  } else {
    return <></>;
  }
};
