import dynamic from "next/dynamic";

import { type Optional } from "utility-types";

import { BaseButtonLink, type BaseButtonLinkProps } from "./base";
import { type LinkContentProps } from "./base/ButtonLinkContent";

const ButtonLinkContent = dynamic(() => import("./base/ButtonLinkContent"));

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
