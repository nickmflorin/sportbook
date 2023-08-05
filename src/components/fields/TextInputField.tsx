import { type FieldPath } from "react-hook-form";

import { type BaseFormValues } from "~/components/forms";
import { TextInput, type TextInputProps } from "~/components/input/TextInput";

import { ControlledField, type ControlledFieldProps } from "./Field";

export interface TextInputFieldProps<K extends FieldPath<I>, I extends BaseFormValues>
  extends Omit<TextInputProps, "value" | "onChange" | "children" | "description" | "label" | "name">,
    Omit<ControlledFieldProps<K, I>, "children"> {}

export const TextInputField = <K extends FieldPath<I>, I extends BaseFormValues>({
  name,
  condition,
  actions,
  label,
  description,
  form,
  style,
  className,
  ...props
}: TextInputFieldProps<K, I>): JSX.Element => (
  <ControlledField
    className={className}
    style={style}
    description={description}
    form={form}
    name={name}
    label={label}
    condition={condition}
    actions={actions}
  >
    {({ field: { onChange, value } }) => <TextInput value={value} onChange={onChange} {...props} />}
  </ControlledField>
);
