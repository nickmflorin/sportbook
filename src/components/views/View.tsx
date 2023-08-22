import { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { CloseButton } from "~/components/buttons/CloseButton";
import { Flex, type FlexProps } from "~/components/structural/Flex";

export interface ViewContainerProps extends Omit<FlexProps, "direction"> {
  readonly bordered?: boolean | "top" | "left" | "right" | "bottom";
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
    direction="column"
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

export interface ViewHeaderProps extends ComponentProps {
  readonly children: JSX.Element | JSX.Element[];
}

export const ViewHeader = ({ children, ...props }: ViewHeaderProps) => (
  <div {...props} className={classNames("view__header", props.className)}>
    {children}
  </div>
);

export interface ViewProps extends Omit<ViewContainerProps, "children"> {
  readonly footer?: JSX.Element;
  readonly header?: JSX.Element | JSX.Element[];
  readonly onClose?: () => void;
  readonly children: ReactNode;
  readonly contentProps?: Omit<ViewContentProps, "children">;
}

export const View = ({
  children,
  footer,
  header,
  contentProps,
  onClose,
  ...props
}: ViewProps & { readonly children: ReactNode }): JSX.Element => (
  <ViewContainer {...props}>
    {onClose && <CloseButton className="view__close-button" onClick={onClose} />}
    {header && <ViewHeader className="view__header">{header}</ViewHeader>}
    <ViewContent {...contentProps}>{children}</ViewContent>
    {footer && <ViewFooter>{footer}</ViewFooter>}
  </ViewContainer>
);

export default View;
