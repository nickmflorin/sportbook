import { useForm as rootUseForm } from "@mantine/form";
import { type UseFormInput, type GetInputPropsType } from "@mantine/form/lib/types";

import {
  type FieldKeys,
  type FormInstance,
  type DefaultFormValues,
  type DefaultTransformer,
  type BaseTransformer,
  assertFieldErrorOrErrors,
} from "./types";

export const useForm = <V = DefaultFormValues, TV extends BaseTransformer<V> = DefaultTransformer<V>>(
  input: UseFormInput<V, TV>,
): FormInstance<V, TV> => {
  const _original = rootUseForm(input);

  return {
    ..._original,
    getFieldError: <F extends FieldKeys<V>>(path: F) => {
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
    getInputProps: <F extends FieldKeys<V>>(
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
