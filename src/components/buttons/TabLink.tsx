import classNames from "classnames";

import { ButtonLink, type ButtonLinkProps } from "./ButtonLink";

export interface TabLinkProps extends Omit<ButtonLinkProps, "children" | "content"> {
  readonly label: string;
  readonly isActive?: boolean;
}

export const TabLink = ({ label, isActive, ...props }: TabLinkProps) => (
  <ButtonLink {...props} className={classNames("tab-link", { "tab-link--active": isActive }, props.className)}>
    {label}
  </ButtonLink>
);
