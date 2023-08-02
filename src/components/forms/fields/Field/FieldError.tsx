import { Text } from "~/components/typography/Text";

export interface FormFieldErrorProps {
  readonly children: string;
}

export const FormFieldError = ({ children }: FormFieldErrorProps): JSX.Element => (
  <Text className="form-field__error">{children}</Text>
);
