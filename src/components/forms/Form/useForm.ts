import { useForm as rootUseForm } from "@mantine/form";
import { type UseFormInput, type GetInputPropsType } from "@mantine/form/lib/types";

import {
  type FieldKeys,
  type FormInstance,
  type DefaultFormValues,
  type BaseFormValues,
  assertFieldErrorOrErrors,
} from "./types";

export type UseFormParams<I extends BaseFormValues = DefaultFormValues, O extends BaseFormValues = I> = Omit<
  UseFormInput<I, (input: I) => O>,
  "initialValues" | "transformValues"
> & {
  initialValues?: I;
};

export const useForm = <I extends BaseFormValues = DefaultFormValues, O extends BaseFormValues = I>(
  input: UseFormParams<I, O>,
): FormInstance<I, O> => {
  const _original = rootUseForm<I, (v: I) => O>(input);

  return {
    ..._original,
    getFieldError: <F extends FieldKeys<I>>(path: F) => {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { error } = _original.getInputProps<F>(path);
      if (error !== undefined && error !== null) {
        assertFieldErrorOrErrors(error);
        return Array.isArray(error) ? error : [error];
      }
      return null;
    },
    /* Modify the original getInputProps such that the error is not included in the arguments passed to the input
       itself.  We pass the error into the custom Field component, which wraps the Input. */
    getInputProps: <F extends FieldKeys<I>>(
      path: F,
      options?: {
        type?: GetInputPropsType;
        withError?: boolean;
        withFocus?: boolean;
      },
    ) => {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { error, ...base } = _original.getInputProps<F>(path, options);
      return base;
    },
  };
};
