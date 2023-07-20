import { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { Loading } from "~/components/loading";

import { Header, type HeaderProps } from "./Header";

export interface BaseViewProps extends ComponentProps {
  readonly children: ReactNode;
  readonly footer?: JSX.Element;
  readonly loading?: boolean;
  readonly contentScrollable?: boolean;
}

type _ViewWithHeaderProps = Omit<HeaderProps, keyof ComponentProps> & {
  readonly header?: never;
};

type _ViewWithHeaderElement = { [key in keyof _ViewWithHeaderProps]?: never } & {
  readonly header: JSX.Element;
};

export type ViewProps = BaseViewProps & (_ViewWithHeaderProps | _ViewWithHeaderElement);

export const View = ({
  className,
  style,
  children,
  loading,
  footer,
  contentScrollable,
  header,
  ...props
}: ViewProps): JSX.Element => (
  <div style={style} className={classNames("view", { "view--content-scrollable": contentScrollable }, className)}>
    {header ? <div className="view__header">{header}</div> : <Header {...props} className="view__header" />}
    <div className="view__content">
      <Loading loading={loading === true}>{children}</Loading>
    </div>
    {footer && <div className="view__footer">{footer}</div>}
  </div>
);
