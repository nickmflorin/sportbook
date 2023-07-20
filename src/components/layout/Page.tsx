import { type LinkProps } from "next/link";
import { type ReactNode } from "react";

import classNames from "classnames";

import { icons } from "~/lib/ui";
import { ActionButton } from "~/components/buttons";
import { Header, type HeaderProps } from "~/components/views/Header";

export interface PageProps extends Omit<HeaderProps, "titleProps"> {
  readonly children: ReactNode;
  readonly header?: JSX.Element;
  readonly backHref?: LinkProps["href"];
}

export const Page = ({ className, style, children, header, backHref, ...props }: PageProps): JSX.Element => (
  <div style={style} className={classNames("page", className)}>
    {backHref && <ActionButton.Bare className="page__back-button" href={backHref} icon={icons.IconNames.ARROW_LEFT} />}
    <div className="page__header">{header || <Header {...props} titleProps={{ order: 4 }} />}</div>
    <div className="page__content">{children}</div>
  </div>
);
