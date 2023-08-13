"use client";
import { type LinkProps } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { UrlObject } from "url";

import classNames from "classnames";
import uniq from "lodash.uniq";

import { type ComponentProps } from "~/lib/ui";
import { type PathActive, pathIsActive } from "~/lib/util/paths";
import { addQueryParamsToUrl } from "~/lib/util/urls";
import { TabLink } from "~/components/buttons/TabLink";
import { type IconProp } from "~/components/icons";

export type TabItem = {
  readonly label: string;
  readonly icon?: IconProp;
  readonly href: LinkProps["href"];
  readonly queryParams?: string[];
  readonly active: PathActive;
  readonly visible?: boolean;
  readonly disabled?: boolean;
};

export interface TabsProps extends ComponentProps {
  readonly tabs: TabItem[];
  readonly queryParams?: string[];
}

export const Tabs = ({ tabs, queryParams = [], ...props }: TabsProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  return (
    <div className={classNames("tabs", props.className)}>
      {tabs.map(({ active, href, ...tab }, i) => {
        if (tab.visible !== false) {
          const paramNames = uniq([...queryParams, ...(tab.queryParams ?? [])]);
          if (paramNames.length !== 0) {
            const params = paramNames.reduce((prev, name) => ({ ...prev, [name]: searchParams.get(name) }), {});
            href = addQueryParamsToUrl(href, params);
          }
          return <TabLink key={i} {...tab} href={href} isActive={pathIsActive(active, pathname)} />;
        } else {
          return <React.Fragment key={i} />;
        }
      })}
    </div>
  );
};
