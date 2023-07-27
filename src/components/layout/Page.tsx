import { type LinkProps } from "next/link";
import React, { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { ActionButton } from "~/components/buttons/ActionButton";
import { Header, type HeaderProps } from "~/components/views/Header";

export interface PageProps extends Pick<HeaderProps, "title" | "description">, ComponentProps {
  readonly children: ReactNode;
  readonly header?: JSX.Element;
  readonly headerProps?: Omit<HeaderProps, "title" | "description">;
  readonly subHeader?: JSX.Element;
  readonly backHref?: LinkProps["href"];
  readonly staticViews?: ReactNode | ReactNode[];
  readonly staticViewWidth?: number;
  readonly staticContentViews?: ReactNode | ReactNode[];
}

export const Page = ({
  className,
  style,
  staticViews,
  staticContentViews,
  children,
  header,
  subHeader,
  backHref,
  staticViewWidth,
  headerProps,
  title,
  description,
}: PageProps): JSX.Element => (
  <div style={style} className={classNames("page", className)}>
    <div className="page__main">
      <div className="page__header">
        {backHref && <ActionButton.Bare className="page__back-button" href={backHref} icon={{ name: "arrow-left" }} />}
        {header || <Header {...headerProps} titleProps={{ order: 4 }} title={title} description={description} />}
        {subHeader}
      </div>
      <div className="page__content">
        <div className="page__content__main">{children}</div>
        {staticContentViews && (
          <div className="page__content__static-views">
            {Array.isArray(staticContentViews)
              ? staticContentViews.map((view, i) => <React.Fragment key={i}>{view}</React.Fragment>)
              : staticContentViews}
          </div>
        )}
      </div>
    </div>
    {staticViews && (
      <div className="page__static-views" style={{ width: staticViewWidth }}>
        {Array.isArray(staticViews)
          ? staticViews.map((view, i) => <React.Fragment key={i}>{view}</React.Fragment>)
          : staticViews}
      </div>
    )}
  </div>
);
