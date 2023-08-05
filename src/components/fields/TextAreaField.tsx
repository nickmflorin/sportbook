import { type FieldPath } from "react-hook-form";

import { type BaseFormValues } from "~/components/forms";
import { TextArea, type TextAreaProps } from "~/components/input/TextArea";

import { ControlledField, type ControlledFieldProps } from "./Field";

export interface TextAreaFieldProps<K extends FieldPath<I>, I extends BaseFormValues>
  extends Omit<TextAreaProps, "value" | "onChange" | "children" | "description" | "label" | "name">,
    Omit<ControlledFieldProps<K, I>, "children"> {}

export const TextAreaField = <K extends FieldPath<I>, I extends BaseFormValues>({
  name,
  condition,
  actions,
  label,
  description,
  form,
  style,
  className,
  ...props
}: TextAreaFieldProps<K, I>): JSX.Element => (
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
    {({ field: { onChange, value } }) => <TextArea value={value} onChange={onChange} {...props} />}
  </ControlledField>
);
