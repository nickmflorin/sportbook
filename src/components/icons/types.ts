import type React from "react";
import { type ReactElement } from "react";

import {
  type IconDefinition as RootIconDefinition,
  type IconStyle as RootIconStyle,
  type IconFamily as RootIconFamily,
  type IconName,
  type IconPrefix as RootIconPrefix,
  type IconLookup as RootIconLookup,
} from "@fortawesome/fontawesome-svg-core";
import { type FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { z } from "zod";

import { isJSXElement } from "~/lib/core";
import { type ComponentProps, type Color, type SizeContain, type SizeAxis } from "~/lib/ui";
import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

export const IconSizes = enumeratedLiterals(["xxs", "xs", "sm", "md", "lg", "xl", "fill"] as const);
export type IconSize = EnumeratedLiteralType<typeof IconSizes>;

export type IconFamily = Exclude<RootIconFamily, "duotone">;

export enum IconFamilies {
  CLASSIC = "classic",
  SHARP = "sharp",
}

const IconFamilyClassNameMap: { [key in IconFamily]: string } = {
  classic: "",
  sharp: "fa-sharp",
};

const DEFAULT_ICON_FAMILY = IconFamilies.SHARP;

export type IconStyle = Exclude<RootIconStyle, "duotone" | "light" | "thin" | "brands">;

export enum IconStyles {
  SOLID = "solid",
  REGULAR = "regular",
}

const DEFAULT_ICON_STYLE = IconStyles.REGULAR;

const IconStyleClassNameMap: { [key in IconStyle]: string } = {
  regular: "fa-regular",
  solid: "fa-solid",
};

// The prefixes used for this application will be restricted to solid, regular, sharp solid and sharp regular.
export type IconPrefix = Extract<RootIconPrefix, "fas" | "far" | "fass" | "fasr">;

export enum IconPrefixes {
  SOLID = "fas",
  REGULAR = "far",
  SHARP_SOLID = "fass",
  SHARP_REGULAR = "fasr",
}

const IconPrefixClassNameMap: { [key in IconPrefix]: string } = {
  far: classNames(IconFamilyClassNameMap.classic, IconStyleClassNameMap.regular),
  fas: classNames(IconFamilyClassNameMap.classic, IconStyleClassNameMap.solid),
  fasr: classNames(IconFamilyClassNameMap.sharp, IconStyleClassNameMap.regular),
  fass: classNames(IconFamilyClassNameMap.sharp, IconStyleClassNameMap.solid),
};

export type IconDefinitionParams = {
  readonly name: IconName;
  readonly family?: IconFamily;
  readonly iconStyle?: IconStyle;
};

// Create our own version of the IconLookup with the restricted prefix.
export type IconLookup = Pick<RootIconLookup, "iconName"> & {
  readonly prefix: IconPrefix;
};

// Create our own version of the IconDefinition with the restricted prefix.
export interface IconDefinition extends Omit<RootIconDefinition, "prefix"> {
  readonly prefix: IconPrefix;
}

const IconDefinitionParamsSchema = z.object({
  name: z.string(),
  family: z.nativeEnum(IconFamilies).optional(),
  iconStyle: z.nativeEnum(IconStyles).optional(),
});

const IconDefinitionSchema = z.object({
  prefix: z.nativeEnum(IconPrefixes),
  iconName: z.string(),
  icon: z.array(z.union([z.number(), z.string(), z.array(z.string())])),
});

type _BaseIconProps = ComponentProps &
  Pick<FontAwesomeIconProps, "spin"> & {
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

export const isIconDefinitionParams = (params: unknown): params is IconDefinitionParams =>
  IconDefinitionParamsSchema.safeParse(params).success;

export const isIconDefinition = (params: unknown): params is IconDefinition =>
  IconDefinitionSchema.safeParse(params).success;

/**
 * Defines the way that an "Icon" can be specified in the props for components in the application - not including the
 * rendered <Icon /> component itself (i.e. {@link IconElement}).
 *
 * @see IconProp
 */
export type BasicIconProp = IconDefinition | IconDefinitionParams;

export const isBasicIconProp = (value: unknown): value is BasicIconProp =>
  isIconDefinitionParams(value) || isIconDefinition(value);

/**
 * The element, {@link React.ReactElement}, that corresponds to the {@link JSX.Element} that is rendered by the
 * {@link Icon} component.
 *
 * This type definition will prevent against cases of that the `icon` prop, {@link IconProp}, can be provided as another
 * <Icon /> element recursively:
 *
 * const E: IconElement = <Icon icon={<Icon icon="slack" /> }/> // Allowed
 * const F: IconElement = <Icon icon={<Icon icon=<Icon icon={"slack"} /> /> }/> // Error
 */
export type IconElement = ReactElement<IconComponentProps, "i">;

/**
 * Defines the way that an "Icon" can be specified in the props for components in the application.
 */
export type IconProp = BasicIconProp | IconElement;

/**
 * A typeguard that returns whether or not the provided icon prop, {@link IconProp}, is a valid JSX.Element
 * corresponding to the <Icon /> component, {@link IconElement}.
 *
 * It is very important that the <Icon /> component sets the `displayName` to "Icon" - otherwise, we cannot safely check
 * if a provided element is in fact a rendered Icon element, {@link IconElement} or another element.
 */
export const isIconElement = (value: IconProp): value is IconElement => isJSXElement(value) && value.type === "i";

export const isIconProp = (value: unknown): value is IconProp => {
  if (isBasicIconProp(value)) {
    return true;
  }
  return isJSXElement(value) && isIconElement(value);
};

/**
 * The props that the component responsible for rendering the Icon component, without the recursive {@link IconElement}
 * value allowed for the `icon` prop.
 */
export type BasicIconComponentProps<P extends IconProp = BasicIconProp> = _BaseIconProps & {
  [key in keyof IconDefinitionParams]?: never;
} & {
  readonly icon: P;
};

export type EmbeddedIconComponentProps = _BaseIconProps &
  IconDefinitionParams & {
    readonly icon?: never;
  };

export type IconComponentProps = BasicIconComponentProps | EmbeddedIconComponentProps;

/**
 * The props that the <Icon /> component accepts, which allows the `icon` prop to be provided by the traditional means,
 * {@link BasicIconProp}, or a nested element, {@link IconElement}.
 */
export type IconProps = EmbeddedIconComponentProps | BasicIconComponentProps<BasicIconProp | IconElement>;

export const getIconNameClassName = (name: IconName) => `fa-${name}`;

export const getIconPrefixClassName = (prefix: IconPrefix) => IconPrefixClassNameMap[prefix];

export const getIconFamilyClassName = (family: IconFamily = DEFAULT_ICON_FAMILY) => IconFamilyClassNameMap[family];

export const getIconStyleClassName = (iconStyle: IconStyle = DEFAULT_ICON_STYLE) => IconStyleClassNameMap[iconStyle];

export type GetNativeIconClassNameParams<P extends IconProp = BasicIconProp> =
  | Pick<BasicIconComponentProps<P>, "icon">
  | Pick<EmbeddedIconComponentProps, keyof IconDefinitionParams>;

type _GetNativeIconClassNameParams<T, P extends IconProp = BasicIconProp> =
  | (T & Pick<BasicIconComponentProps<P>, "icon">)
  | (T & Pick<EmbeddedIconComponentProps, keyof IconDefinitionParams>);

export const isBasicIconComponentProps = <T, P extends IconProp = BasicIconProp>(
  params: _GetNativeIconClassNameParams<T, P>,
): params is T & Pick<BasicIconComponentProps<P>, "icon"> =>
  (params as T & Pick<BasicIconComponentProps<P>, "icon">).icon !== undefined;

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
export const getNativeIconClassName = <T>(params: _GetNativeIconClassNameParams<T>): string => {
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
