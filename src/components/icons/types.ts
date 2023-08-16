import {
  type IconDefinition as RootIconDefinition,
  type IconStyle as RootIconStyle,
  type IconFamily as RootIconFamily,
  type IconName,
  type IconPrefix as RootIconPrefix,
  type IconLookup as RootIconLookup,
} from "@fortawesome/fontawesome-svg-core";
import classNames from "classnames";

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
