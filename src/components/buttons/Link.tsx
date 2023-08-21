import { type Optional } from "utility-types";

import { ButtonLinkContent, BaseLink, type BaseLinkProps, type LinkContentProps } from "./base";

export type LinkProps = Optional<BaseLinkProps, "children"> &
  Omit<LinkContentProps, "component" | "children"> & {
    readonly content?: JSX.Element;
    readonly children?: string | JSX.Element;
  };

export const Link = ({ icon, iconSize, iconLocation, children, content, ...props }: LinkProps) => (
  <BaseLink {...props}>
    {content !== undefined ? (
      content
    ) : (
      <ButtonLinkContent component="link" iconSize={iconSize} iconLocation={iconLocation} icon={icon}>
        {children}
      </ButtonLinkContent>
    )}
  </BaseLink>
);
