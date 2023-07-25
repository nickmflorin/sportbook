import { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { Loading } from "~/components/loading";

import { Header, type HeaderProps } from "./Header";

export interface ViewContainerProps extends ComponentProps {
  readonly loading?: boolean;
  readonly bordered?: boolean;
  readonly contentScrollable?: boolean;
}

export const ViewContainer = ({
  loading,
  children,
  bordered,
  contentScrollable,
  ...props
}: ViewContainerProps & { readonly children: ReactNode }) => (
  <div
    {...props}
    className={classNames(
      "view",
      { "view--bordered": bordered, "view--content-scrollable": contentScrollable },
      props.className,
    )}
  >
    <Loading loading={loading === true}>{children}</Loading>
  </div>
);

export interface ViewContentProps extends ComponentProps {
  readonly children: ReactNode;
  readonly loading?: boolean;
}

export const ViewContent = ({ loading, children, ...props }: ViewContentProps) => (
  <div {...props} className={classNames("view__content", props.className)}>
    <Loading loading={loading === true}>{children}</Loading>
  </div>
);

type ViewHeaderProps = Omit<HeaderProps, keyof ComponentProps>;

export const ViewHeader = (props: ViewHeaderProps) => <Header {...props} className="view__header" />;

export const ViewFooter = ({ children, ...props }: ComponentProps & { readonly children: ReactNode }) => (
  <div {...props} className={classNames("view__footer", props.className)}>
    {children}
  </div>
);

export interface BaseViewProps
  extends Omit<ViewContentProps, keyof ComponentProps | "children">,
    Omit<ViewContainerProps, "children"> {
  readonly footer?: JSX.Element;
}

type _ViewWithHeaderProps = BaseViewProps &
  Pick<ViewHeaderProps, "title" | "description" | "actions"> & {
    readonly header?: never;
    readonly headerProps?: Omit<ViewHeaderProps, "title" | "description" | "actions">;
  };

type _ViewWithHeaderElement = BaseViewProps & { [key in keyof ViewHeaderProps]?: never } & {
  readonly header: JSX.Element;
  readonly headerProps?: never;
};

export type WithViewProps<T> = (_ViewWithHeaderProps & T) | (_ViewWithHeaderElement & T);

export type ViewProps = _ViewWithHeaderProps | _ViewWithHeaderElement;

export const View = ({
  children,
  footer,
  header,
  title,
  description,
  actions,
  headerProps,
  ...props
}: ViewProps & { readonly children: ReactNode }): JSX.Element => (
  <ViewContainer {...props}>
    {header ? (
      <div className="view__header">{header}</div>
    ) : (
      <Header {...headerProps} title={title} description={description} actions={actions} className="view__header" />
    )}
    <ViewContent>{children}</ViewContent>
    {footer && <ViewFooter>{footer}</ViewFooter>}
  </ViewContainer>
);

View.Container = ViewContainer;
View.Content = ViewContent;
View.Header = ViewHeader;

export default View;
