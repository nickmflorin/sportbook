import React, { forwardRef, type ForwardedRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { pluckNativeComponentProps, icons } from "~/lib/ui";
import { SizeAxes, SizeContains } from "~/lib/ui/constants";

export const useIconProps = ({
  size = icons.IconSizes.MD,
  axis = SizeAxes.VERTICAL,
  contain = SizeContains.FIT,
  color = "gray.7",
  ...props
}: Pick<icons.IconComponentProps, "axis" | "size" | "contain" | "color" | "className" | "style">) =>
  pluckNativeComponentProps(
    {
      className: classNames("icon", `icon--contain-${contain}`, `icon--size-${size}`, `icon--axis-${axis}`),
    },
    { color, ...props },
  );

export type SpinnerProps = Omit<icons.IconComponentProps, "spin" | "icon" | "contain">;

export const Spinner = ({ color = "blue.6", loading, ...props }: SpinnerProps): JSX.Element =>
  loading ? (
    <_IconComponent
      {...props}
      color={color}
      className={classNames("spinner", props.className)}
      spin={true}
      loading={false}
      icon={icons.IconNames.CIRCLE_NOTCH}
      contain={SizeContains.SQUARE}
    />
  ) : (
    <></>
  );

function _IconComponent({
  ref,
  loading,
  spinnerColor,
  icon,
  spin,
  ...props
}: icons.IconComponentProps & { readonly ref?: ForwardedRef<SVGSVGElement> }) {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [_, nativeProps] = useIconProps(props);
  if (loading === true) {
    // Use the original style and className before it was modified by the hook.
    return <Spinner loading={true} style={props.style} className={props.className} color={spinnerColor} />;
  }
  return <FontAwesomeIcon {...nativeProps} spin={spin} ref={ref} icon={icons.getNativeIcon(icon)} />;
}

const ForwardedIconComponent = forwardRef((props: icons.IconComponentProps, ref: ForwardedRef<SVGSVGElement>) => (
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
const _Icon = forwardRef(function Icon({ icon, ...props }: icons.IconProps, ref: ForwardedRef<SVGSVGElement>) {
  if (icons.isIconElement(icon)) {
    return icons.mergeIconElementWithProps(icon, props);
  }
  return <IconComponent {...props} ref={ref} icon={icon} />;
});

/* It is important that we define the displayName and name such that the `_Icon` component above can properly determine
   whether or not the provided prop is an actual <Icon /> element or the prefix/name traditional specification. */
export const Icon = Object.assign(React.memo(_Icon), { displayName: "Icon", name: "Icon" });
