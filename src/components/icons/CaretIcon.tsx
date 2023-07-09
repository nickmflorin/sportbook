import classNames from "classnames";

import { icons, type CSSDirection, CSSDirections } from "~/lib/ui";

import { Icon } from "./Icon";

type CaretIconProps = Omit<icons.IconComponentProps, "icon"> & {
  readonly direction?: Exclude<CSSDirection, typeof CSSDirections.LEFT | typeof CSSDirections.RIGHT>;
};

export const CaretIcon = ({ direction = CSSDirections.DOWN, ...props }: CaretIconProps) => (
  <Icon
    className={classNames("icon--caret", props.className)}
    {...props}
    icon={direction === CSSDirections.DOWN ? icons.IconNames.CARET_DOWN : icons.IconNames.CARET_UP}
  />
);
