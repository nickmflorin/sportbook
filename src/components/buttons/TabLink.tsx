import classNames from "classnames";

import { ContentLink, type ContentLinkProps } from "./base";

export interface TabLinkProps extends Omit<ContentLinkProps, "children"> {
  readonly label: string;
  readonly isActive?: boolean;
}

export const TabLink = ({ label, isActive, ...props }: TabLinkProps) => (
  <ContentLink {...props} className={classNames("tab-link", { "tab-link--active": isActive }, props.className)}>
    {label}
  </ContentLink>
);
