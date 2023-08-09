import classNames from "classnames";

import { View, type ViewProps } from "~/components/views/View";

export type DrawerViewProps = Omit<ViewProps, "contentScrollable">;

export const DrawerView = ({ children, ...props }: DrawerViewProps): JSX.Element => (
  <View {...props} className={classNames("drawer-view", props.className)} contentScrollable>
    {children}
  </View>
);
