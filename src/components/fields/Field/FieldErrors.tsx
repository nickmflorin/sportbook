import { type FieldError } from "../../forms/types";

import { FormFieldError } from "./FieldError";

export interface FormFieldErrorsProps {
  readonly errors: FieldError[];
}

export const FormFieldErrors = ({ errors }: FormFieldErrorsProps): JSX.Element =>
  errors.length !== 0 ? (
    <div className="form-field__errors">
      {errors.map((e, i) => (
        <FormFieldError key={i}>{e}</FormFieldError>
      ))}
    </div>
  ) : (
    <></>
  );
