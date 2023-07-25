import classNames from "classnames";

import { Page, type PageProps } from "./Page";
import { Tabs, type TabItem } from "./Tabs";

export type DetailPageProps = Omit<PageProps, "header" | "imageSize" | "subHeader"> & {
  readonly tabs?: TabItem[];
};

export const DetailPage = ({ children, tabs, ...props }: DetailPageProps): JSX.Element => (
  <Page
    {...props}
    headerProps={{ ...props.headerProps, imageProps: { ...props.headerProps?.imageProps, size: 80 } }}
    className={classNames("detail-page", props.className)}
    subHeader={tabs && tabs.length !== 0 ? <Tabs tabs={tabs} /> : undefined}
  >
    {children}
  </Page>
);
