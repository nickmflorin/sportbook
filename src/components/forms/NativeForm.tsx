import { type UseFormReturnType } from "@mantine/form";
import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";

export type NativeFormProps<T extends Record<string, unknown>> = Pick<ComponentProps, "className" | "style"> & {
  readonly form: UseFormReturnType<T>;
  readonly children: JSX.Element | JSX.Element[];
  readonly action?: (data: T) => void;
};

export const NativeForm = <T extends Record<string, unknown>>({
  action,
  form,
  children,
  ...props
}: NativeFormProps<T>): JSX.Element => (
  <form
    {...props}
    className={classNames("form", props.className)}
    action={(formData: FormData) => {
      const result = form.validate();
      if (result.hasErrors) {
        form.setErrors(result.errors);
      } else {
        /* TODO: We want to use the formData to reconstruct the values that are provided to the action.  However,
           Mantine's inputs are controlled (not uncontrolled) and their 'useForm' hook passes the values in.  This means
           that we would have to use our own 'useForm' hook, and potentially input elements, to get that to work. It is
           something that we will want to do eventually, but not yet. */
        action?.(form.values);
      }
    }}
  >
    {children}
  </form>
);
