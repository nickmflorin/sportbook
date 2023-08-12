import { type LinkProps } from "next/link";
import React, { type ReactNode } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { BackButton } from "~/components/buttons/BackButton";
import { InfoView, type InfoViewProps } from "~/components/views/InfoView";

export interface PageProps extends Pick<InfoViewProps, "title" | "description">, ComponentProps {
  readonly children: ReactNode;
  readonly header?: JSX.Element;
  readonly headerProps?: Omit<InfoViewProps, "title" | "description">;
  readonly subHeader?: JSX.Element;
  readonly backHref?: LinkProps["href"];
  readonly backText?: string;
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
  backText,
}: PageProps): JSX.Element => (
  <div style={style} className={classNames("page", className)}>
    <div className="page__main">
      <div className="page__header">
        {backHref && <BackButton href={backHref}>{backText}</BackButton>}
        {header || <InfoView {...headerProps} titleProps={{ order: 4 }} title={title} description={description} />}
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
