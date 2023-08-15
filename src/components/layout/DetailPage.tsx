import dynamic from "next/dynamic";

import classNames from "classnames";

import { Page, type PageProps } from "./Page";
import { type TabItem } from "./Tabs";

const Tabs = dynamic(() => import("./Tabs"));

export type DetailPageProps = Omit<PageProps, "header" | "imageSize" | "subHeader"> & {
  readonly tabs?: TabItem[];
  readonly tabQueryParams?: string[];
};

export const DetailPage = ({ children, tabQueryParams, tabs, ...props }: DetailPageProps): JSX.Element => (
  <Page
    {...props}
    headerProps={{ ...props.headerProps, image: { ...props.headerProps?.image, size: 80 } }}
    className={classNames("detail-page", props.className)}
    subHeader={tabs && tabs.length !== 0 ? <Tabs tabs={tabs} queryParams={tabQueryParams} /> : undefined}
  >
    {children}
  </Page>
);
