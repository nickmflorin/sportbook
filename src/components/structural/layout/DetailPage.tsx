import { Page, type PageProps } from "./Page";

export type DetailPageProps = Omit<PageProps, "header" | "imageSize">;

export const DetailPage = ({ children, ...props }: DetailPageProps): JSX.Element => (
  <Page {...props} imageSize={80}>
    {children}
  </Page>
);
