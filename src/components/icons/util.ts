import { type IconName } from "@fortawesome/fontawesome-svg-core";
import { z } from "zod";

import {
  type IconProp,
  IconFamilies,
  type IconFamily,
  type IconStyle,
  IconStyles,
  IconPrefixes,
  type IconPrefix,
  type IconDefinition,
  type IconDefinitionParams,
  type IconComponentProps,
  type BasicIconComponentProps,
  IconPrefixClassNameMap,
  IconStyleClassNameMap,
  IconFamilyClassNameMap,
  DEFAULT_ICON_FAMILY,
  DEFAULT_ICON_STYLE,
} from "./types";

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

export const isIconDefinitionParams = (params: unknown): params is IconDefinitionParams =>
  IconDefinitionParamsSchema.safeParse(params).success;

export const isIconDefinition = (params: unknown): params is IconDefinition =>
  IconDefinitionSchema.safeParse(params).success;

export const isIconProp = (value: unknown): value is IconProp =>
  isIconDefinitionParams(value) || isIconDefinition(value);

export const getIconNameClassName = (name: IconName) => `fa-${name}`;

export const getIconPrefixClassName = (prefix: IconPrefix) => IconPrefixClassNameMap[prefix];

export const getIconFamilyClassName = (family: IconFamily = DEFAULT_ICON_FAMILY) => IconFamilyClassNameMap[family];

export const getIconStyleClassName = (iconStyle: IconStyle = DEFAULT_ICON_STYLE) => IconStyleClassNameMap[iconStyle];

export const isBasicIconComponentProps = <T>(
  params: IconComponentProps<IconProp>,
): params is T & Pick<BasicIconComponentProps, "icon"> =>
  (params as T & Pick<BasicIconComponentProps, "icon">).icon !== undefined;
