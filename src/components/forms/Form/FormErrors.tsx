"use client";
import { useState, useImperativeHandle } from "react";

import { type ServerErrorResponseBody } from "~/application/errors";

import { FormError } from "./FormError";

export interface IFormErrors {
  readonly addServerError: (error: ServerErrorResponseBody) => void;
  readonly clearErrors: () => void;
}

export interface FormErrorsProps {
  readonly handler: React.RefObject<IFormErrors>;
}

export const FormErrors = ({ handler }: FormErrorsProps): JSX.Element => {
  const [errors, setErrors] = useState<string[]>([]);

  useImperativeHandle(handler, () => ({
    clearErrors: () => setErrors([]),
    addServerError: (error: ServerErrorResponseBody) => {
      setErrors(prev => [...prev, error.message]);
    },
  }));

  if (errors.length === 0) {
    return <></>;
  }
  return (
    <div className="form__errors">
      {errors.map((e, i) => (
        <FormError key={i}>{e}</FormError>
      ))}
    </div>
  );
};
