import classNames from "classnames";

import { Header, type HeaderProps } from "~/components/views/Header";

export interface ViewHeaderProps extends HeaderProps {
  readonly children?: JSX.Element;
}

export const ViewHeader = ({ className, style, children, ...props }: ViewHeaderProps): JSX.Element => (
  <div style={style} className={classNames("view__header", className)}>
    <Header className="view__primary-header" {...props} />
    {children}
  </div>
);
