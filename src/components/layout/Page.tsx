import { type ReactNode } from "react";

import classNames from "classnames";

import { Header, type HeaderProps } from "~/components/structural/Header";

export interface PageProps extends Omit<HeaderProps, "titleProps"> {
  readonly children: ReactNode;
  readonly header?: JSX.Element;
}

export const Page = ({ className, style, children, header, ...props }: PageProps): JSX.Element => (
  <div style={style} className={classNames("page", className)}>
    <div className="page__header">{header || <Header {...props} titleProps={{ order: 4 }} />}</div>
    <div className="page__content">{children}</div>
  </div>
);
