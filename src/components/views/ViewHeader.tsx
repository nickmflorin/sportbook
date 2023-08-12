import classNames from "classnames";

import { InfoView, type InfoViewProps } from "~/components/views/InfoView";

export interface ViewHeaderProps extends InfoViewProps {
  readonly children?: JSX.Element;
}

export const ViewHeader = ({ className, style, children, ...props }: ViewHeaderProps): JSX.Element => (
  <div style={style} className={classNames("view__header", className)}>
    <InfoView className="view__primary-header" {...props} />
    {children}
  </div>
);
