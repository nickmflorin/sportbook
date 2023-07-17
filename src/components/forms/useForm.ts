import { useForm as rootUseForm } from "@mantine/form";
import { type UseFormInput, type GetInputPropsType } from "@mantine/form/lib/types";

import {
  type FormKeys,
  type FormInstance,
  type DefaultFormValues,
  type BaseFormValues,
  type FieldError,
  assertFieldErrorOrErrors,
} from "./types";

export type UseFormParams<I extends BaseFormValues = DefaultFormValues, O extends BaseFormValues = I> = Omit<
  UseFormInput<I, (input: I) => O>,
  "initialValues" | "transformValues"
> & {
  initialValues: I;
  form?: FormInstance<I, O>;
};

export const useForm = <I extends BaseFormValues = DefaultFormValues, O extends BaseFormValues = I>({
  form,
  ...input
}: UseFormParams<I, O>): FormInstance<I, O> => {
  if (form) {
    return form;
  }
  const _original = rootUseForm<I, (v: I) => O>(input);

  const _getFieldErrors = <F extends FormKeys<I>>(path: F) => {
    const { error } = _original.getInputProps<F>(path);
    if (error !== undefined && error !== null) {
      assertFieldErrorOrErrors(error);
      return Array.isArray(error) ? error : [error];
    }
    return [];
  };

  return {
    ..._original,
    getInitialValues: () => input.initialValues,
    getFieldErrors: <F extends FormKeys<I>>(...paths: F[]) =>
      paths.reduce((prev: FieldError[], path: F) => [...prev, ..._getFieldErrors(path)], []),
    /* Modify the original getInputProps such that the error is not included in the arguments passed to the input
       itself.  We pass the error into the custom Field component, which wraps the Input. */
    getInputProps: <F extends FormKeys<I>>(
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
