import { LoadingOverlay } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";

import { LocalFeedback, type Feedback } from "~/components/feedback";
import { ButtonFooter, type ButtonFooterProps } from "~/components/structural/ButtonFooter";

export type FormProps<T extends Record<string, unknown>> = Omit<ButtonFooterProps, "onSubmit" | "submitButtonType"> & {
  readonly form: UseFormReturnType<T>;
  readonly children: JSX.Element | JSX.Element[];
  readonly feedback?: Feedback;
  readonly fieldGap?: string | number;
  readonly loading?: boolean;
  readonly action?: (data: T) => void;
};

export const Form = <T extends Record<string, unknown>>({
  feedback,
  fieldGap,
  action,
  form,
  children,
  ...props
}: FormProps<T>): JSX.Element => (
  <form
    className="form"
    action={(formData: FormData) => {
      const result = form.validate();
      if (result.hasErrors) {
        form.setErrors(result.errors);
      } else {
        /* TODO: We want to use the formData to reconstruct the values that are provided to the action.  However,
           Mantine's inputs are controlled (not uncontrolled) and their 'useForm' hook passes the values in.  This
           means that we would have to use our own 'useForm' hook, and potentially input elements, to get that to work.
           It is something that we will want to do eventually, but not yet. */
        action?.(form.values);
      }
    }}
  >
    <div className="form__content">
      {/* TODO: Replace me with internal loading indicators. */}
      <LoadingOverlay visible={props.loading === true} />
      {children}
    </div>
    <LocalFeedback feedback={feedback} />
    <ButtonFooter {...props} submitDisabled={props.submitDisabled || props.loading} />
  </form>
);
