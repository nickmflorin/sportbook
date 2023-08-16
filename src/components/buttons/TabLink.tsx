"use client";
import { usePathname, useSearchParams } from "next/navigation";

import classNames from "classnames";

import { type PathActive, pathIsActive } from "~/lib/util/paths";
import { addQueryParamsToUrl } from "~/lib/util/urls";

import { ButtonLink, type ButtonLinkProps } from "./ButtonLink";

export interface TabLinkProps extends Omit<ButtonLinkProps, "children" | "content"> {
  readonly label: string;
  readonly active?: PathActive;
  readonly paramNames?: string[];
}

export const TabLink = ({ label, href, paramNames = [], active, ...props }: TabLinkProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (paramNames.length !== 0) {
    const params = paramNames.reduce((prev, name) => ({ ...prev, [name]: searchParams.get(name) }), {});
    href = addQueryParamsToUrl(href, params);
  }
  return (
    <ButtonLink
      {...props}
      href={href}
      className={classNames(
        "tab-link",
        { "tab-link--active": active ? pathIsActive(active, pathname) : false },
        props.className,
      )}
    >
      {label}
    </ButtonLink>
  );
};
