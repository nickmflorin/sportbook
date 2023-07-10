import { type UseFormReturnType } from "@mantine/form";
import { type _TransformValues, type LooseKeys, type GetInputProps } from "@mantine/form/lib/types";

export type BaseFormValues = Record<string, unknown>;
export type DefaultFormValues = Record<string, unknown>;
export type BaseTransformer<V extends BaseFormValues = DefaultFormValues> = _TransformValues<V>;
export type DefaultTransformer<V extends BaseFormValues = DefaultFormValues> = (values: V) => V;

export type FieldKeys<V extends BaseFormValues> = LooseKeys<V>;

// We will likely need to expand this type.
export type FieldError = string;

export type FieldErrorAssertion = (v: unknown) => asserts v is FieldError;

export const assertFieldError: FieldErrorAssertion = (v: unknown) => {
  if (typeof v !== "string") {
    throw new TypeError(`The value ${JSON.stringify(v)} is not a valid field error!`);
  }
};

export const assertFieldErrorOrErrors: FieldErrorAssertion = (v: unknown) => {
  if (Array.isArray(v)) {
    v.map((vi: unknown) => assertFieldError(vi));
  } else if (typeof v !== "string") {
    throw new TypeError(`The value ${JSON.stringify(v)} is not a valid field error!`);
  }
};

/**
 * Defines the initial values for the Form as the type inferred from the schema but with the added flexibility of
 * allowing values to be null when the Form is first rendered.
 *
 * The @mantine/form package does a bad job typing the 'initialValues' such that it allows values that are required by
 * the schema to be initially null.  To alleviate this issue, we incorporate our own type, FormInitialValues, which
 * provides the flexibility of initializing values for the Form in a null state, even if they are required and not
 * nullable by the schema.  Then, we force coerce the type of the 'initialValues' in the custom 'useForm' hook, back to
 * the original form of the values that is consistent with the schema, and consistent with what the original 'useForm'
 * hook expects.
 */
export type FormInitialValues<V extends Record<string, unknown>> = { [key in keyof V]: V[key] | null };

export type FormInstance<
  V extends BaseFormValues = DefaultFormValues,
  TV extends BaseTransformer<V> = DefaultTransformer<V>,
> = Omit<UseFormReturnType<V, TV>, "getInputProps"> & {
  /* The @mantine/form package types the errors for each field as "any" - for now, we will assume they are either a
     single string or an array of strings, and make an assertion as such.  We may need to expand this type in the
     future. */
  readonly getFieldError: <F extends FieldKeys<V>>(path: F) => FieldError[] | null;
  readonly getInputProps: (...args: Parameters<GetInputProps<V>>) => Omit<ReturnType<GetInputProps<V>>, "error">;
};
