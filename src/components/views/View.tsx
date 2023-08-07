import { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { Loading } from "~/components/loading";

import { ViewHeader, type ViewHeaderProps } from "./ViewHeader";

export interface ViewContainerProps extends ComponentProps {
  readonly bordered?: boolean;
  readonly contentScrollable?: boolean;
}

export const ViewContainer = ({
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
    {children}
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

export const ViewFooter = ({ children, ...props }: ComponentProps & { readonly children: ReactNode }) => (
  <div {...props} className={classNames("view__footer", props.className)}>
    {children}
  </div>
);

export interface ViewProps
  extends Omit<ViewContainerProps, "children">,
    Pick<ViewHeaderProps, "title" | "description" | "actions"> {
  readonly footer?: JSX.Element;
  readonly header?: JSX.Element;
  readonly children: ReactNode;
  readonly headerProps?: Omit<ViewHeaderProps, "title" | "description" | "actions">;
}

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
    {header ? header : <ViewHeader {...headerProps} title={title} description={description} actions={actions} />}
    <ViewContent>{children}</ViewContent>
    {footer && <ViewFooter>{footer}</ViewFooter>}
  </ViewContainer>
);

View.Container = ViewContainer;
View.Content = ViewContent;
View.Header = ViewHeader;

export default View;
