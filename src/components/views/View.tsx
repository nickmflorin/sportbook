import { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { Loading } from "~/components/loading";
import { Flex, type FlexProps } from "~/components/structural/Flex";

import { ViewHeader, type ViewHeaderProps } from "./ViewHeader";

export interface ViewContainerProps extends Omit<FlexProps, "direction"> {
  readonly bordered?: boolean;
  readonly contentScrollable?: boolean;
}

export const ViewContainer = ({
  children,
  bordered,
  contentScrollable,
  ...props
}: ViewContainerProps & { readonly children: ReactNode }) => (
  <Flex
    {...props}
    className={classNames(
      "view",
      { "view--bordered": bordered, "view--content-scrollable": contentScrollable },
      props.className,
    )}
  >
    {children}
  </Flex>
);

export interface ViewContentProps extends Omit<FlexProps, "direction"> {
  readonly children: ReactNode;
}

export const ViewContent = ({ children, ...props }: ViewContentProps) => (
  <Flex {...props} className={classNames("view__content", props.className)}>
    {children}
  </Flex>
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
  readonly contentProps?: Omit<ViewContentProps, "children">;
}

export const View = ({
  children,
  footer,
  header,
  title,
  description,
  actions,
  headerProps,
  contentProps,
  ...props
}: ViewProps & { readonly children: ReactNode }): JSX.Element => (
  <ViewContainer {...props}>
    {header ? header : <ViewHeader {...headerProps} title={title} description={description} actions={actions} />}
    <ViewContent {...contentProps}>{children}</ViewContent>
    {footer && <ViewFooter>{footer}</ViewFooter>}
  </ViewContainer>
);

View.Container = ViewContainer;
View.Content = ViewContent;
View.Header = ViewHeader;

export default View;
