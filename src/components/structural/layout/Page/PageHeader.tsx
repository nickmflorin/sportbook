import { Header, type HeaderProps } from "~/components/structural/Header";

export type PageHeaderProps = Omit<HeaderProps, "titleProps" | "descriptionProps">;

export const PageHeader = (props: PageHeaderProps): JSX.Element => <Header {...props} />;
