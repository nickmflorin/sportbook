import React, { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { LocalFeedback, type Feedback } from "~/components/feedback";
import { Loading } from "~/components/loading";

import { Header, type HeaderProps } from "./Header";

interface PartitionedContentRenderProps {
  readonly className: string;
  readonly style?: React.CSSProperties;
  readonly children: JSX.Element[];
}

export interface PartitionedContentProps
  extends Pick<ComponentProps, "className" | "style">,
    Omit<HeaderProps, keyof ComponentProps> {
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
  description,
  actions,
  children,
  loading,
  feedback,
  footer,
}: PartitionedContentProps): JSX.Element =>
  container({
    style,
    className: classNames("partitioned-content", className),
    children: [
      <Header
        key="0"
        className="partitioned-content__header"
        title={title}
        description={description}
        actions={actions}
      />,
      <div key="1" className="partitioned-content__content">
        <Loading loading={loading}>{children}</Loading>
      </div>,
      <React.Fragment key="2">
        <div className="partitioned-content__footer">
          <LocalFeedback feedback={feedback} mb="md" />
          {footer}
        </div>
      </React.Fragment>,
    ],
  });
