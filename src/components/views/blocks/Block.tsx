import classNames from "classnames";

import { View, type ViewProps } from "~/components/views/View";

export type BlockProps = ViewProps;

export const Block = (props: ViewProps): JSX.Element => (
  <View {...props} className={classNames("block", props.className)} />
);
