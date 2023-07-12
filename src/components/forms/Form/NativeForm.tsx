import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";

import { type FormInstance, type BaseFormValues, type DefaultFormValues } from "./types";

export type NativeFormProps<I extends BaseFormValues = DefaultFormValues, O extends BaseFormValues = I> = Pick<
  ComponentProps,
  "className" | "style"
> & {
  readonly form: FormInstance<I, O>;
  readonly children: JSX.Element | JSX.Element[];
  readonly action?: (data: O) => void;
};

export const NativeForm = <I extends BaseFormValues = DefaultFormValues, O extends BaseFormValues = I>({
  action,
  form,
  children,
  ...props
}: NativeFormProps<I, O>): JSX.Element => (
  <form
    {...props}
    className={classNames("form", props.className)}
    action={(formData: FormData) => {
      /* TODO: We want to use the formData to reconstruct the values that are provided to the action.  However,
         Mantine's inputs are controlled (not uncontrolled) and their 'useForm' hook passes the values in.  This means
         that we would have to use our own 'useForm' hook, and potentially input elements, to get that to work. It is
         something that we will want to do eventually, but not yet. */
      const result = form.validate();
      if (result.hasErrors) {
        form.setErrors(result.errors);
      } else {
        /*
        Note: Value Transformation

        The way that our 'useForm' hook is setup is such that the two generic types, I and O, represent the type of the
        unvalidated form input and the type of the schema-validated form output, respectively.  Mantine's Form and
        associated 'useForm' hook do not respect these two separate typings, and only treat the


        */
        /* Note: The result of getTransformedValues() is the same as form.values, because we do not provide a transform
           function to the 'useForm' hook but instead rely on the schema to validate that the current values in the
           form are the output type of the schema. */
        action?.(form.getTransformedValues());
      }
    }}
  >
    {children}
  </form>
);
