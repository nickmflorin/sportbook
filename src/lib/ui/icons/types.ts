import type React from "react";
import { type ReactElement } from "react";

import { type FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { z } from "zod";

import {
  IconNames,
  IconCodes,
  Icons,
  IconPrefixes,
  type IconCode,
  type IconPrefix,
} from "~/application/config/fontAwesome/constants";
import * as core from "~/lib/core";
import { type ComponentProps, type Color } from "~/lib/ui";
import { type SizeAxis, type SizeContain } from "~/lib/ui/types";
import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

export * from "~/application/config/fontAwesome/constants";

export type IconLibrary = typeof Icons;

export type IconType = IconPrefix | IconCode;

export const IconCodeSchema = z.enum([...IconCodes.__ALL__]);
export const isIconCode = (value: unknown): value is IconCode => IconCodeSchema.safeParse(value).success;

export const IconPrefixSchema = z.enum([...IconPrefixes.__ALL__]);
export const isIconPrefix = (value: unknown): value is IconPrefix => IconPrefixSchema.safeParse(value).success;

/**
 * Represents the prefix, {@link IconPrefix}, or the code, {@link IconCode}, for a given Icon name, {@link IconName}.
 * The code, {@link IconCode}, is simply a more intuitive, human readable representation of the {@link IconPrefix} -
 * which is usually a more obscure 3 character code that FontAwesome uses.
 *
 * A given Font Awesome Icon has both a name, {@link IconName}, and a prefix {@link IconPrefix}. The prefix ("far",
 * "fab", "fas") indicates the form that the given name, {@link IconName}, is included as in the icon registry.  For
 * instance, you might have an Icon with a name "exclamation-triangle" but only the "far" (regular) form of that Icon is
 * included in our Icon registry.
 *
 * But, a given name, {@link IconName}, can be associated with multiple prefixes, {@link IconPrefix} - and by definition
 * multiple codes, {@link IconCode}.  For instance, we may have an icon with the name "exclamation-circle" that is
 * included in the registry in both code = "regular" and code = "solid" forms.
 *
 * For those cases, the Icon component will use a default code/prefix in the case that the `icon` prop is provided as
 * just the name, "exclamation-circle".  If a more specific form is needed, the `icon` prop must be specified as, for
 * example, ["regular", "exclamation-circle"].
 *
 * @see IconPrefix
 * @see IconCode
 */
export type IconName = EnumeratedLiteralType<typeof IconNames>;

export const IconNameSchema = z.enum([...IconNames.__ALL__]);
export const isIconName = (name: unknown): name is IconName => IconNameSchema.safeParse(name).success;

export const IconSolidSchema = z.object({
  type: z.literal(IconCodes.SOLID),
  name: z.enum([...Icons[IconCodes.SOLID]]),
});
export const IconRegularSchema = z.object({
  type: z.literal(IconCodes.REGULAR),
  name: z.enum([...Icons[IconCodes.REGULAR]]),
});

export const IconSchema = z.union([IconSolidSchema, IconRegularSchema]);

/**
 * Represents the information that is used to render an icon in the application.
 */
export type Icon = z.infer<typeof IconSchema>;
export const isIcon = (icon: unknown): icon is Icon => IconSchema.safeParse(icon).success;

export type IconAssertion = (icon: unknown) => asserts icon is Icon;

export const assertIsIcon: IconAssertion = (icon: unknown) => {
  if (!isIcon(icon)) {
    throw new Error(`The value '${JSON.stringify(icon)}' is not a valid icon!`);
  }
};

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
export type IconElement = ReactElement<IconComponentProps, React.FunctionComponent<IconComponentProps>>;

/**
 * Represents the ways in which an icon can be specified in the application, excluding the {@link IconElement} itself.
 *
 * If provided as just the name, {@link IconName}, the {@link Icon} component will use a prefix, {@link IconPrefix} (or
 * code, {@link IconCode}) that is configured as the default and is registered for the given {@link IconName}.  In cases
 * where an {@link IconName} is registered with multiple prefixes, the prop should be provided as an array of the prefix
 * (or code) and name: ["far", "exclamation-circle"] or ["regular", "exclamation-circle"].
 *
 * @see IconType
 */
export type BasicIconProp = IconName | Icon;

export const BasicIconPropSchema = z.union([IconNameSchema, IconSchema]);
export const isBasicIconProp = (value: unknown): value is BasicIconProp => BasicIconPropSchema.safeParse(value).success;

/**
 * The way that an "Icon" should be defined in the props for components in the application.
 *
 * A given component that accepts an `icon` (or similarly named) prop should allow it to be either:
 *
 * 1. A traditional specification, {@link BaseIconProp} - such as "slack" or ["brand", "slack"]
 *    <Button icon={"slack"} /> // Okay
 *
 * 2. Another icon element, {@link IconElement}:
 *    <Button icon={<Icon className={"specific-icon"} /> } />
 */
export type IconProp = BasicIconProp | IconElement;

/**
 * A typeguard that returns whether or not the provided icon prop, {@link IconProp}, is a valid JSX.Element
 * corresponding to the <Icon /> component, {@link IconElement}.
 *
 * It is very important that the <Icon /> component sets the `displayName` to "Icon" - otherwise, we cannot safely check
 * if a provided element is in fact a rendered Icon element, {@link IconElement} or another element.
 */
export const isIconElement = (value: IconProp): value is IconElement =>
  core.isSpecificReactElement(value, { name: "Icon" });

export const isIconProp = (value: unknown): value is IconProp =>
  core.isJSXElement(value) ? isIconElement(value as IconProp) : isBasicIconProp(value);

export const IconSizes = enumeratedLiterals(["xxs", "xs", "sm", "md", "lg", "xl", "fill"] as const);
export type IconSize = EnumeratedLiteralType<typeof IconSizes>;

type _BaseIconProps = ComponentProps &
  Pick<FontAwesomeIconProps, "spin" | "strokeWidth"> & {
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
 * The props that the component responsible for rendering the Icon component, without the recursive {@link IconElement}
 * value allowed for the `icon` prop.
 */
export type IconComponentProps = _BaseIconProps & {
  readonly icon: BasicIconProp;
};

/**
 * The props that the <Icon /> component accepts, which allows the `icon` prop to be provided by the traditional means,
 * {@link BasicIconProp}, or a nested element, {@link IconElement}.
 */
export type IconProps = _BaseIconProps & {
  readonly icon: IconProp;
};
