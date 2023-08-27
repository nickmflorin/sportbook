import {
  type IconDefinition as RootIconDefinition,
  type IconStyle as RootIconStyle,
  type IconFamily as RootIconFamily,
  type IconName,
  type IconPrefix as RootIconPrefix,
  type IconLookup as RootIconLookup,
} from "@fortawesome/fontawesome-svg-core";
import classNames from "classnames";

import { type Color, type SizeContain, type ComponentProps, type SizeAxis } from "~/lib/ui";
import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

export const IconSizes = enumeratedLiterals(["xxs", "xs", "sm", "md", "lg", "xl", "fill"] as const);
export type IconSize = EnumeratedLiteralType<typeof IconSizes>;

export type IconFamily = Exclude<RootIconFamily, "duotone">;

export enum IconFamilies {
  CLASSIC = "classic",
  SHARP = "sharp",
}

export const IconFamilyClassNameMap: { [key in IconFamily]: string } = {
  classic: "",
  sharp: "fa-sharp",
};

export const DEFAULT_ICON_FAMILY = IconFamilies.SHARP;

export type IconStyle = Exclude<RootIconStyle, "duotone" | "light" | "thin" | "brands">;

export enum IconStyles {
  SOLID = "solid",
  REGULAR = "regular",
}

export const DEFAULT_ICON_STYLE = IconStyles.REGULAR;

export const IconStyleClassNameMap: { [key in IconStyle]: string } = {
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

export const IconPrefixClassNameMap: { [key in IconPrefix]: string } = {
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

/**
 * Defines the way that an "Icon" can be specified in the props for components in the application.
 */
export type IconProp = IconDefinition | IconDefinitionParams;

export type DynamicIcon = {
  readonly icon: IconProp;
  readonly visible: boolean;
};

/**
 * Represents an icon that can be dynamically changed due to user interaction after the first render.
 *
 * see src/styles/globals/components/icons.scss for further information.
 *
 * Background:
 * ----------
 * The FontAwesome icon configuration works as follows:
 *
 * (1) The FontAwesome pro script is loaded via a <Script />
 * (2) The script looks for <i> tags with the proper icon class name (i.e. fa-chevron-up) and nests an <svg> tag inside
 *     of the <i> tag, with the same attributes as the <i> tag (i.e. class name, style, etc.)
 *
 * This is done so that FontAwesome can *only* load the necessary CSS and SVGs for the icons that are actually used in
 * the application.  This also means that it will only load the necessary CSS and SVGs for the icons that are defined
 * when the elements are first rendered.
 *
 * Problem:
 * --------
 * What is the problem with this?  The problem is that it prevents icons from changing after the first render,
 * particularly as it relates to user interaction.  If a component uses two different icons, where the second icon may
 * not be shown until after the first render when the user interacts with the component, not only will the second icon
 * not be loaded by FontAwesome initially - or at all - but the <svg> class name will indicate the original icon that
 * was rendered, even if the <i> class name changes.
 *
 * For example, if we consider a button that toggles the icon between "chevron-up" and "chevron-down" when it is
 * clicked, the HTML structure will exhibit the following behavior:
 *
 * // Before User Interaction & Before Font Awesome Loads
 * <button>
 *   <i class="fa fa-chevron-up" />
 * </button>
 *
 * // Before User Interaction but After Font Awesome Loads
 * <button>
 *   <i class="fa fa-chevron-up">
 *     <svg class="fa fa-chevron-up" /> // This is responsible for rendering the actual Icon.
 *   </i>
 * </button>
 *
 * // After User Interaction and After Font Awesome Loads
 * <button>
 *   <i class="fa fa-chevron-down">
 *     <svg class="fa fa-chevron-up" /> // This is responsible for rendering the actual Icon.
 *   </i>
 * </button>
 *
 * Note how after the user clicks the button, the class on the <i> tags changes appropriately (this is because our
 * Icon component is responsible for that class name,  based on the 'icon' prop).  However, the underlying svg class
 * name does not change - this is because the svg is populated by FontAwesome when it first loads the script.  The
 * resulting effect is that the actual icon that is rendered will not change - because the class on the <i> tag is only
 * used by FontAwesome to define the class on the <svg> when it is initially rendered - but does not change the svg
 * class name after the fact.
 *
 * Solution
 * --------
 * The solution to this problem is that when a component uses multiple icons and the icon may change after the first
 * render, it has to render both of them - but apply "display: none" to the icon or icon(s) that are not currently
 * being shown.  When the interaction occurs, such as a button click, the Icon component will then toggle which <i>
 * element has the "display: none" style attribute.
 *
 * // Before User Interaction & Before Font Awesome Loads
 * <button>
 *   <i class="fa fa-chevron-up" />
 * </button>
 *
 * // Before User Interaction but After Font Awesome Loads
 * <button>
 *   <i class="fa fa-chevron-up">
 *     <svg class="fa fa-chevron-up" />
 *   </i>
 *   <i class="fa fa-chevron-down" style="display: none;">
 *     <svg class="fa fa-chevron-down" style="display: none;" /> // Style attribute is copied to the nested svg.
 *   </i>
 * </button>
 *
 * However, since FontAwesome will copy all of the attributes on the <i> element to the nested <svg> element, when we
 * remove or add the "display: none" tag on the <i> element, it will not have the same effect on the nested <svg>.  To
 * fix this, we need to add "!important" to the "display: inherit" style on the <svg> element - ensuring that when the
 * <i> element is hidden or shown, the nested <svg> element will also be hidden or shown - and since the <svg> is
 * rendered in the DOM (but just hidden), the icon will appropriately change after user interaction occurs.
 *
 * // After User Interaction and After Font Awesome Loads
 * <button>
 *   <i class="fa fa-chevron-up" style="display: none;">
 *     // Display none is still not inlined, but the important flag overrides.
 *     <svg class="fa fa-chevron-up" />
 *   </i>
 *   <i class="fa fa-chevron-down">
 *     // Display none is still inlined, but the important flag overrides.
 *     <svg class="fa fa-chevron-down" style="display: none;"/>
 *   </i>
 * </button>
 *
 * This type is then used to represent an icon that should be rendered in the DOM, but only shown when the conditional
 * evaluates to true - allowing the icon to be loaded by FontAwesome's script while also allowing the icon to be
 * dynamically visible.
 */
export type DynamicIconProp = DynamicIcon[];

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
    /**
     * Used to control dynamically rendered icons.
     *
     * @see DynamicIconProp;
     */
    readonly visible?: boolean;
    readonly disabled?: boolean;
    readonly onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  };

/**
 * The props that the component responsible for rendering the Icon component.
 */
export type BasicIconComponentProps<I extends IconProp | DynamicIconProp = IconProp> = Omit<
  _BaseIconProps,
  "loading"
> & {
  [key in keyof IconDefinitionParams]?: never;
} & {
  readonly icon: I;
};

export type EmbeddedIconComponentProps = Omit<_BaseIconProps, "loading"> &
  IconDefinitionParams & {
    readonly icon?: never;
  };

export type IconComponentProps<I extends IconProp | DynamicIconProp = IconProp> =
  | BasicIconComponentProps<I>
  | EmbeddedIconComponentProps;

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
