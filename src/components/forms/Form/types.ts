import { type UseFormReturnType } from "@mantine/form";
import { type LooseKeys, type GetInputProps } from "@mantine/form/lib/types";

export type BaseFormValues = Record<string, unknown>;
export type DefaultFormValues = Record<string, unknown>;

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

export type FormInstance<I extends BaseFormValues = DefaultFormValues, O extends BaseFormValues = I> = Omit<
  UseFormReturnType<I, (v: I) => O>,
  "getInputProps"
> & {
  /* The @mantine/form package types the errors for each field as "any" - for now, we will assume they are either a
     single string or an array of strings, and make an assertion as such.  We may need to expand this type in the
     future. */
  readonly getFieldError: <F extends FieldKeys<I>>(path: F) => FieldError[];
  readonly getFieldErrors: <F extends FieldKeys<I>>(path: F[]) => FieldError[];
  readonly getInputProps: (...args: Parameters<GetInputProps<I>>) => Omit<ReturnType<GetInputProps<I>>, "error">;
};
