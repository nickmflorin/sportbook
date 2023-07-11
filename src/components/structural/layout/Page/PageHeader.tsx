import classNames from "classnames";

import { Header, type HeaderProps } from "~/components/structural/Header";

export type PageHeaderProps = Omit<HeaderProps, "titleProps" | "descriptionProps">;

export const PageHeader = (props: PageHeaderProps): JSX.Element => (
  <Header {...props} className={classNames("page__header", props.className)} titleProps={{ order: 3 }} />
);
