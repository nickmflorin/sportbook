"use client";
import React from "react";

import classNames from "classnames";

import { logger } from "~/application/logger";
import { getColorClassName } from "~/lib/ui";

import {
  IconSizes,
  type IconProp,
  type IconDefinitionParams,
  type DynamicIconProp,
  type BasicIconComponentProps,
  type EmbeddedIconComponentProps,
  type IconComponentProps,
} from "./types";
import {
  isIconDefinitionParams,
  getIconFamilyClassName,
  getIconNameClassName,
  getIconPrefixClassName,
  getIconStyleClassName,
  isBasicIconComponentProps,
} from "./util";

export type GetNativeIconClassNameParams =
  | Pick<BasicIconComponentProps, "icon">
  | Pick<EmbeddedIconComponentProps, keyof IconDefinitionParams>;

export const getNativeIconName = (params: IconComponentProps<IconProp>): string => {
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
 * @param {IconComponentProps<IconProp>} params
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
export const getNativeIconClassName = (params: IconComponentProps<IconProp>): string => {
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

const DynamicIconClassNamePropNames = [
  "contain",
  "size",
  "axis",
  "color",
  "focusedColor",
  "hoveredColor",
  "disabled",
] as const;

type DynamicIconClassNamePropName = (typeof DynamicIconClassNamePropNames)[number];

type DynamicIconClassNameProps = Pick<IconComponentProps, DynamicIconClassNamePropName>;

type DynamicIconClassNameConfig<N extends DynamicIconClassNamePropName> = (
  dynamic: DynamicIconClassNameProps[N],
) => string | null;

const DynamicClassNameConfig: { [key in DynamicIconClassNamePropName]: DynamicIconClassNameConfig<key> } = {
  disabled: v => (v !== undefined ? "disabled" : null),
  contain: v => (v !== undefined ? `icon--contain-${v}` : null),
  size: v => (v !== undefined ? `icon--size-${v}` : null),
  axis: v => (v !== undefined ? `icon--axis-${v}` : null),
  color: v => (v !== undefined ? getColorClassName("color", v) : null),
  hoveredColor: v => (v !== undefined ? getColorClassName("color", v, "hovered") : null),
  focusedColor: v => (v !== undefined ? getColorClassName("color", v, "focused") : null),
};

const getDynamicIconClassName = (props: Pick<IconComponentProps, DynamicIconClassNamePropName>): string =>
  [...DynamicIconClassNamePropNames].reduce(<N extends DynamicIconClassNamePropName>(prev: string, curr: N) => {
    const propName = curr as N;
    return classNames(prev, DynamicClassNameConfig[propName](props[propName]));
  }, "");

const getIconClassName = ({ icon, name, iconStyle, family, ...props }: IconComponentProps): string =>
  classNames(
    "icon",
    getNativeIconClassName({ icon, name, iconStyle, family } as GetNativeIconClassNameParams),
    getDynamicIconClassName(props),
    { "fa-spin": props.spin },
    props.className,
  );

const iconIsDynamic = (icon: IconProp | DynamicIconProp): icon is DynamicIconProp => Array.isArray(icon);

export const IconComponent = ({
  size = IconSizes.MD,
  axis,
  contain,
  style,
  icon,
  visible,
  hidden,
  onClick,
  ...props
}: IconComponentProps<IconProp | DynamicIconProp>) => {
  const isVisible = hidden !== true && visible !== false;
  if (icon !== undefined || props.name !== undefined) {
    if (icon !== undefined && iconIsDynamic(icon)) {
      const visibleIcons = icon.filter(i => i.visible === true);
      if (visibleIcons.length === 0) {
        logger.error(
          { icon: icon },
          "The dynamically provided set of icons does not include a visible icon.  No icon will be rendered.",
        );
        return <></>;
      } else if (visibleIcons.length > 1) {
        logger.error(
          { icon: icon },
          "The dynamically provided set of icons includes multiple visible icons.  Only the first will be rendered.",
        );
      }
      let visibleIconEncountered = false;
      return (
        <>
          {icon.map((i, index) => {
            // Omit the hidden flag - it is encompassed in the isVisible flag.
            const ps = { ...props, icon: i.icon, size, axis, contain } as IconComponentProps<IconProp>;
            if (i.visible && !visibleIconEncountered) {
              visibleIconEncountered = true;
              // The hidden prop will cause all dynamic icons to be hidden.
              return <IconComponent {...ps} visible={isVisible && true} onClick={onClick} key={index} />;
            }
            return <IconComponent {...ps} visible={false} key={index} />;
          })}
        </>
      );
    }
    /* The "@fortawesome/react-fontawesome" package's <FontAwesomeIcon /> component does not work properly with the
       FontAwesome Icon Kit.  We use the Icon Kit because it dynamically loads just the icons that we need from a CDN -
       which is much faster and easier to maintain.  However, it does not work with React - only CSS classes.  Since
       the <FontAwesomeIcon /> component simply renders an SVG element, we can mimic its behavior by rendering an SVG
       inside of an <i> element, where the <i> element is given the Font Awesome class names that are defined in the
       content loaded from the CDN (these class names are generated via 'getNativeIconClassName' below). */
    const ps = { ...props, icon, size, axis, contain } as IconComponentProps<IconProp>;
    return (
      <i
        onClick={e => {
          if (props.disabled !== true) {
            onClick?.(e);
          }
        }}
        style={isVisible === false ? { ...style, display: "none" } : style}
        className={getIconClassName(ps)}
      />
    );
  } else {
    return <></>;
  }
};

export default IconComponent;
