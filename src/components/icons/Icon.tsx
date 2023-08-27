import dynamic from "next/dynamic";
import React from "react";

import { type Optional } from "utility-types";

import {
  type DynamicIconProp,
  type IconComponentProps,
  type EmbeddedIconComponentProps,
  type BasicIconComponentProps,
} from "./types";
import { isBasicIconComponentProps } from "./util";

const Spinner = dynamic(() => import("./Spinner"));
const IconComponent = dynamic(() => import("./IconComponent"));

const _Icon = (props: IconComponentProps): JSX.Element => {
  if (isBasicIconComponentProps<IconComponentProps>(props)) {
    const { icon, ...rest } = props;
    return <IconComponent icon={icon} {...rest} />;
  }
  return <IconComponent {...props} />;
};

export type IconProps =
  | (Optional<EmbeddedIconComponentProps, "name"> & { readonly loading?: boolean })
  | (Optional<BasicIconComponentProps, "icon"> & { readonly loading?: boolean })
  | (Optional<BasicIconComponentProps<DynamicIconProp>, "icon"> & { readonly loading?: boolean });

/**
 * Renders a FontAwesome icon based on the provided `icon` prop.
 *
 * This component represents the primary definition for an icon in the application and the above <IconComponent />
 * should not be used outside of this file.
 *
 * This <Icon /> component allows the `icon` prop to be provided as either an element, {@link IconElement}, or a
 * name/prefix definition, {@link IconProp} (e.g. ["far", "slack"]).  This allows components that accept an `icon`
 * prop to accept it either as an `<Icon />` rendered element, {@link IconElement}, or a prefix/name combination,
 * {@link IconProp}, while still rendering the provided prop inside of an `<Icon />` element it defines:
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
export const Icon = ({ loading, spinnerColor, name, icon, ...props }: IconProps): JSX.Element => {
  if (icon !== undefined || name !== undefined) {
    if (loading === true) {
      return <Spinner loading={loading} {...props} color={spinnerColor || props.color} />;
    }
    const iconComponentProps: IconComponentProps = { ...props, name, icon } as IconComponentProps;
    return <_Icon {...iconComponentProps} />;
  } else if (loading !== undefined) {
    return <Spinner loading={loading} {...props} />;
  }
  return <></>;
};

export default Icon;
