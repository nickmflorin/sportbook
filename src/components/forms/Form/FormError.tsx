import { Text } from "~/components/typography/Text";

export interface FormErrorProps {
  readonly children: string;
}

export const FormError = ({ children }: FormErrorProps): JSX.Element => <Text className="form__error">{children}</Text>;
