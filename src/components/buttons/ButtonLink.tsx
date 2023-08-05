import { type Optional } from "utility-types";

import { ButtonLinkContent, BaseButtonLink, type BaseButtonLinkProps, type LinkContentProps } from "./base";

export type ButtonLinkProps = Optional<BaseButtonLinkProps, "children"> &
  Omit<LinkContentProps, "component"> & {
    readonly content?: JSX.Element;
  };

export const ButtonLink = ({ icon, iconLocation, children, content, ...props }: ButtonLinkProps) => (
  <BaseButtonLink {...props}>
    {content !== undefined ? (
      content
    ) : (
      <ButtonLinkContent component="link" iconLocation={iconLocation} icon={icon}>
        {children}
      </ButtonLinkContent>
    )}
  </BaseButtonLink>
);
