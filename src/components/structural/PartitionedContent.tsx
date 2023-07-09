import React, { type ReactNode } from "react";

import { IconX } from "@tabler/icons-react";
import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";

import { Header, type ExposedHeaderProps } from "./Header";

interface PartitionedContentRenderProps {
  readonly className: string;
  readonly style?: React.CSSProperties;
  readonly children: JSX.Element[];
}

export interface PartitionedContentProps extends Pick<ComponentProps, "className" | "style">, ExposedHeaderProps {
  readonly onClose?: () => void;
  readonly container?: (props: PartitionedContentRenderProps) => JSX.Element;
  readonly children: ReactNode;
  readonly footer?: JSX.Element | JSX.Element[];
}

const DEFAULT_CONTAINER = ({ className, style, children }: PartitionedContentRenderProps) => (
  <div style={style} className={className}>
    {children}
  </div>
);

export const PartitionedContent = ({
  container = DEFAULT_CONTAINER,
  className,
  style,
  title,
  subTitle,
  actions,
  children,
  footer,
  onClose,
}: PartitionedContentProps): JSX.Element =>
  container({
    style,
    className: classNames("partitioned-content", className),
    children: [
      <Header
        key="0"
        className="partitioned-content__header"
        title={title}
        subTitle={subTitle}
        actions={onClose ? [...(actions || []), { icon: IconX, onClick: () => onClose?.() }] : actions}
      />,
      <div key="1" className="partitioned-content__content">
        {children}
      </div>,
      <React.Fragment key="2">
        {footer ? <div className="partitioned-content__footer">{footer}</div> : <></>}
      </React.Fragment>,
    ],
  });
