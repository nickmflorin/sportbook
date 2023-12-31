import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";
import { type IconProp, type IconSize, type DynamicIconProp } from "~/components/icons";
import { type FocusedHoverPopoverProps } from "~/components/tooltips/FocusedHoverPopover";

export type ButtonPopoverProps = FocusedHoverPopoverProps;

export const ButtonTypes = enumeratedLiterals(["solid", "alternate", "action"] as const);
export type ButtonType = EnumeratedLiteralType<typeof ButtonTypes>;

export const ButtonSizes = enumeratedLiterals(["xs", "sm", "md", "lg"] as const);
export type ButtonSize = EnumeratedLiteralType<typeof ButtonSizes>;

export const ButtonVariants = enumeratedLiterals(["primary", "secondary", "bare", "danger", "outline"] as const);
export type ButtonVariant = EnumeratedLiteralType<typeof ButtonVariants>;

export const ButtonCornerStyles = enumeratedLiterals(["rounded", "square", "normal"] as const);
export type ButtonCornerStyle = EnumeratedLiteralType<typeof ButtonCornerStyles>;

export type ButtonAction = {
  readonly icon: IconProp | DynamicIconProp;
  /* Note: We cannot disable an icon that is clickable, because the disabled class name will apply to the icon and not
     change afterwards due to the SVG nesting that FontAwesome uses (see information related to DynamicIconProp). */
  readonly hidden?: boolean;
  readonly visible?: boolean;
  readonly iconSize?: IconSize;
  readonly loading?: boolean;
  readonly onClick: (e: React.MouseEvent<HTMLElement>) => void;
};
