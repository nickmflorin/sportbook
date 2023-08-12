import classNames from "classnames";

import { Loading } from "~/components/loading/Loading";
import { type ViewProps } from "~/components/views/View";
import { View } from "~/components/views/View";

export type DrawerViewProps = Omit<ViewProps, "contentScrollable"> & {
  readonly loading?: boolean;
  readonly onClose?: () => void;
};

export const DrawerView = ({ children, loading, onClose, ...props }: DrawerViewProps): JSX.Element => (
  <View {...props} className={classNames("drawer", props.className)} contentScrollable onClose={onClose}>
    <Loading loading={loading === true} />
    {children}
  </View>
);

export default DrawerView;
