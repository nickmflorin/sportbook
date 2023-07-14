import { type JSX } from "react";

import { type LooseKeys } from "@mantine/form/lib/types";
import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";
import { Label, Text } from "~/components/typography";

import { type FormInstance, type DefaultFormValues, type BaseFormValues } from "../types";

import { FormFieldErrors } from "./FieldErrors";

export const FieldConditions = enumeratedLiterals(["required", "optional"] as const);
export type FieldCondition = EnumeratedLiteralType<typeof FieldConditions>;

const ConditionLabels: { [key in FieldCondition]: string } = {
  [FieldConditions.OPTIONAL]: "optional",
  [FieldConditions.REQUIRED]: "required",
};

const FieldConditionText = ({ condition }: { condition: FieldCondition }): JSX.Element => (
  <div className="form-field__condition">
    <Text color="gray.8" style={{ marginRight: 1 }}>
      (
    </Text>
    <Text color="gray.7">{ConditionLabels[condition]}</Text>
    <Text color="gray.8" style={{ marginLeft: 1 }}>
      )
    </Text>
  </div>
);

export interface FieldProps<C extends JSX.Element | JSX.Element[] = JSX.Element | JSX.Element[]>
  extends ComponentProps {
  readonly children: C;
  readonly label?: string;
  readonly condition?: FieldCondition;
  readonly description?: string;
}

export const Field = <C extends JSX.Element | JSX.Element[] = JSX.Element | JSX.Element[]>({
  children,
  label,
  condition,
  description,
  ...props
}: FieldProps<C>): JSX.Element => (
  <div {...props} className={classNames("form-field", props.className)}>
    {(condition !== undefined || label !== undefined) && (
      <div className="form-field__header">
        {label && <Label className="form-field__label">{label}</Label>}
        {condition && <FieldConditionText condition={condition} />}
      </div>
    )}
    {description !== undefined && <Text className="form-field__description">{description}</Text>}
    {children}
  </div>
);

export interface FieldControlProps<
  F extends LooseKeys<I>,
  I extends BaseFormValues = DefaultFormValues,
  O extends BaseFormValues = I,
> extends FieldProps<JSX.Element> {
  readonly name: F;
  readonly form: FormInstance<I, O>;
}

export const FieldControl = <
  F extends LooseKeys<I>,
  I extends BaseFormValues = DefaultFormValues,
  O extends BaseFormValues = I,
>({
  name,
  form,
  children,
  ...props
}: FieldControlProps<F, I, O>): JSX.Element => {
  const errors = form.getFieldError(name);
  return (
    <Field {...props}>
      {children}
      {errors && <FormFieldErrors errors={errors} />}
    </Field>
  );
};

export interface FieldGroupProps extends ComponentProps, FieldProps {}

export const FieldGroup = ({ children, ...props }: FieldGroupProps): JSX.Element => (
  <Field {...props} className={classNames("form-field-group", props.className)}>
    <>{children}</>
  </Field>
);

export interface FieldGroupControlProps<
  F extends LooseKeys<I>,
  I extends BaseFormValues = DefaultFormValues,
  O extends BaseFormValues = I,
> extends FieldGroupProps {
  readonly names: F[];
  readonly form: FormInstance<I, O>;
}

export const FieldGroupControl = <
  F extends LooseKeys<I>,
  I extends BaseFormValues = DefaultFormValues,
  O extends BaseFormValues = I,
>({
  names,
  children,
  form,
  ...props
}: FieldGroupControlProps<F, I, O>): JSX.Element => {
  const errors = form.getFieldErrors(names);
  return (
    <FieldGroup {...props}>
      <>{children}</>
      {errors && <FormFieldErrors errors={errors} />}
    </FieldGroup>
  );
};
