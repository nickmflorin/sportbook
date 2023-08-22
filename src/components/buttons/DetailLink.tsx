"use client";
import { usePathname, useSearchParams } from "next/navigation";

import { addQueryParamsToUrl, type RawQuery } from "~/lib/util/urls";

import { AlternateButton, type AlternateButtonProps } from "./AlternateButton";

export interface DetailLinkProps
  extends Omit<AlternateButtonProps<"secondary">, "variant" | "href" | "onClick" | "children"> {
  readonly href: string | { query: RawQuery; replaceQuery?: boolean };
  readonly children: string;
}

export const DetailLink = ({ href, children, ...props }: DetailLinkProps): JSX.Element => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  return (
    <AlternateButton.Secondary
      href={
        typeof href === "string"
          ? href
          : href.replaceQuery
          ? addQueryParamsToUrl(pathname, href.query, { replaceAll: href.replaceQuery })
          : addQueryParamsToUrl(pathname, searchParams, href.query)
      }
      {...props}
    >
      {children}
    </AlternateButton.Secondary>
  );
};

export default DetailLink;
