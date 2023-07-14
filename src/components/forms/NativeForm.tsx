import classNames from "classnames";

import { type ComponentProps, type HTMLElementProps } from "~/lib/ui";

export type NativeFormProps = ComponentProps &
  Pick<HTMLElementProps<"form">, "action"> & {
    readonly children: JSX.Element | JSX.Element[];
  };

export const NativeForm = ({ children, ...props }: NativeFormProps): JSX.Element => (
  <form {...props} className={classNames("form", props.className)}>
    {children}
  </form>
);
