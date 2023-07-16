import type React from "react";

import { type UseFormReturnType } from "@mantine/form";

export type BaseFormValues = Record<string, unknown>;
export type DefaultFormValues = Record<string, unknown>;

// We will likely need to expand this type.
export type FieldError = string;

export type FieldErrorAssertion = (v: unknown) => asserts v is FieldError;

export type FormKeys<I extends BaseFormValues = DefaultFormValues> = keyof I;

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
  "getInputProps" | "onSubmit"
> & {
  /* The @mantine/form package types the errors for each field as "any" - for now, we will assume they are either a
     single string or an array of strings, and make an assertion as such.  We may need to expand this type in the
     future. */
  readonly getFieldErrors: <F extends FormKeys<I>>(...path: F[]) => FieldError[];
  readonly getInputProps: <F extends FormKeys<I>>(
    path: F,
  ) => {
    // This is the ReturnType of GetInputProps with the 'error' field removed and better typing incorporated.
    value: I[F];
    onChange: (v: I[F] | React.ChangeEvent) => void;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any -- We should type this better, but this is from the original hook. */
    checked?: any;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any -- We should type this better, but this is from the original hook. */
    onFocus?: any;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any -- We should type this better, but this is from the original hook. */
    onBlur?: any;
  };
};
