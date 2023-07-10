import { useForm as rootUseForm } from "@mantine/form";
import { type UseFormInput, type GetInputPropsType } from "@mantine/form/lib/types";

import {
  type FieldKeys,
  type FormInstance,
  type DefaultFormValues,
  type DefaultTransformer,
  type BaseTransformer,
  type BaseFormValues,
  type FormInitialValues,
  assertFieldErrorOrErrors,
} from "./types";

export type UseFormParams<
  V extends BaseFormValues = DefaultFormValues,
  TV extends BaseTransformer<V> = DefaultTransformer<V>,
> = Omit<UseFormInput<V, TV>, "initialValues"> & {
  initialValues?: FormInitialValues<V>;
};

export const useForm = <
  V extends BaseFormValues = DefaultFormValues,
  TV extends BaseTransformer<V> = DefaultTransformer<V>,
>(
  input: UseFormParams<V, TV>,
): FormInstance<V, TV> => {
  const _original = rootUseForm({
    ...input,
    /* The @mantine/form package does a bad job typing the 'initialValues' such that it allows values that are required
       by the schema to be initially null.  To alleviate this issue, we incorporate our own type, FormInitialValues,
       which provides the flexibility of initializing values for the Form in a null state, even if they are required and
       not nullable by the schema.  Then, we force coerce the type of the 'initialValues' here, back to the original
       form of the values that is consistent with the schema, and consistent with what the original 'useForm' hook
       expects. */
    initialValues: input.initialValues as V | undefined,
  });

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
