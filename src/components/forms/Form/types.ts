import { type UseFormReturnType } from "@mantine/form";
import { type _TransformValues, type LooseKeys, type GetInputProps } from "@mantine/form/lib/types";

export type DefaultFormValues = Record<string, unknown>;
export type BaseTransformer<V = DefaultFormValues> = _TransformValues<V>;
export type DefaultTransformer<V = DefaultFormValues> = (values: V) => V;

export type FieldKeys<V> = LooseKeys<V>;

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

export type FormInstance<V = DefaultFormValues, TV extends BaseTransformer<V> = DefaultTransformer<V>> = Omit<
  UseFormReturnType<V, TV>,
  "getInputProps"
> & {
  /* The @mantine/form package types the errors for each field as "any" - for now, we will assume they are either a
     single string or an array of strings, and make an assertion as such.  We may need to expand this type in the
     future. */
  readonly getFieldError: <F extends FieldKeys<V>>(path: F) => FieldError[] | null;
  readonly getInputProps: (...args: Parameters<GetInputProps<V>>) => Omit<ReturnType<GetInputProps<V>>, "error">;
};
