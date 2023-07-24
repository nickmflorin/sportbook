import { type ReactNode } from "react";

import classNames from "classnames";

import { View, type ViewProps } from "~/components/views/View";

export type BlockProps = ViewProps & {
  readonly children: ReactNode;
};

export const Block = ({ children, ...props }: BlockProps): JSX.Element => (
  <View {...props} className={classNames("block", props.className)}>
    {children}
  </View>
);
