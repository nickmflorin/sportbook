import React, { forwardRef, type ForwardedRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { pluckNativeComponentProps } from "~/lib/ui";
import { SizeAxes } from "~/lib/ui/constants";
import {
  type IconComponentProps,
  type IconProps,
  IconSizes,
  getNativeIcon,
  isIconElement,
  mergeIconElementWithProps,
} from "~/lib/ui/icons";

function _IconComponent({
  icon,
  size = IconSizes.MEDIUM,
  axis = SizeAxes.VERTICAL,
  contain,
  ref,
  ...props
}: IconComponentProps & { readonly ref?: ForwardedRef<SVGSVGElement> }) {
  const [rest, nativeProps] = pluckNativeComponentProps(
    {
      className: classNames(
        "icon",
        contain !== undefined && `icon--contain-${contain}`,
        size !== undefined && typeof size !== "number" && `icon--size-${size}`,
        `icon--axis-${axis}`,
      ),
    },
    props,
  );

  return <FontAwesomeIcon {...rest} {...nativeProps} ref={ref} icon={getNativeIcon(icon)} />;
}

const ForwardedIconComponent = forwardRef((props: IconComponentProps, ref: ForwardedRef<SVGSVGElement>) => (
  <_IconComponent {...props} ref={ref} />
)) as typeof _IconComponent;

export const IconComponent = React.memo(ForwardedIconComponent);

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
const _Icon = forwardRef(function Icon({ icon, ...props }: IconProps, ref: ForwardedRef<SVGSVGElement>) {
  if (isIconElement(icon)) {
    return mergeIconElementWithProps(icon, props);
  }
  return <IconComponent {...props} ref={ref} icon={icon} />;
});

/* It is important that we define the displayName and name such that the `_Icon` component above can
   properly determine whether or not the provided prop is an actual <Icon /> element or the
   prefix/name traditional specification. */
export const Icon = Object.assign(React.memo(_Icon), { displayName: "Icon", name: "Icon" });
