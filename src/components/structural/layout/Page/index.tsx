import { type ReactNode } from "react";

import classNames from "classnames";

import { PageHeader, type PageHeaderProps } from "./PageHeader";

export interface PageProps extends PageHeaderProps {
  readonly children: ReactNode;
}

export const Page = ({ className, style, children, ...props }: PageProps): JSX.Element => (
  <div style={style} className={classNames("page", className)}>
    <PageHeader {...props} />
    <div className="page__content">{children}</div>
  </div>
);
