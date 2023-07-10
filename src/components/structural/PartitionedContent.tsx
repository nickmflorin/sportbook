import React, { type ReactNode } from "react";

import { LoadingOverlay } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import classNames from "classnames";

import { LocalFeedback, type Feedback } from "~/components/feedback";
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
  readonly loading?: boolean;
  readonly feedback?: Feedback;
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
  loading,
  feedback,
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
        <LoadingOverlay visible={loading === true} />
        {children}
      </div>,
      <React.Fragment key="2">
        <div className="partitioned-content__footer">
          <LocalFeedback feedback={feedback} mb="md" />
          {footer}
        </div>
      </React.Fragment>,
    ],
  });
