"use client";
import { IconX } from "@tabler/icons-react";
import classNames from "classnames";

import { ActionIcon } from "~/components/buttons/ActionIcon";
import { Portal } from "~/components/layout/Portal";
import { Header, HeaderProps } from "~/components/structural/Header";

export interface DrawerProps extends Pick<HeaderProps, "title" | "subTitle"> {
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly open: boolean;
  readonly children: React.ReactNode;
  readonly onClose?: () => void;
  readonly footer?: JSX.Element | JSX.Element[];
}

export const Drawer = ({ open, footer, children, title, subTitle, onClose, ...props }: DrawerProps): JSX.Element => {
  if (open) {
    return (
      <Portal id="drawer-target">
        <div {...props} className={classNames("drawer", props.className)}>
          <Header
            className="drawer__header"
            title={title}
            subTitle={subTitle}
            actions={[<ActionIcon key="0" icon={IconX} onClick={() => onClose?.()} />]}
          />
          <div className="drawer__content">{children}</div>
          {footer && <div className="drawer__footer">{footer}</div>}
        </div>
      </Portal>
    );
  }
  return <></>;
};
