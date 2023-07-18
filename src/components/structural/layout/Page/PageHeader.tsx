import classNames from "classnames";

import { Header, type HeaderProps } from "~/components/structural/Header";

/* For now, we will disallow a description in the PageHeader - this is so that we can keep the PageHeader at a constant
   height and allow proper scrolling of nested content inside of the PageContent (i.e. Table(s)). */
export type PageHeaderProps = Omit<HeaderProps, "titleProps" | "descriptionProps" | "description">;

export const PageHeader = (props: PageHeaderProps): JSX.Element => (
  <Header {...props} className={classNames("page__header", props.className)} titleProps={{ order: 3 }} />
);
