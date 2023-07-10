import { type LooseKeys } from "@mantine/form/lib/types";
import classNames from "classnames";

import { Label, Text } from "~/components/typography";
import { type ComponentProps } from "~/lib/ui";
import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

import { type FormInstance, type DefaultFormValues, type DefaultTransformer, type BaseTransformer } from "../types";

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

export interface FieldProps<
  F extends LooseKeys<V>,
  V = DefaultFormValues,
  TV extends BaseTransformer<V> = DefaultTransformer<V>,
> extends Pick<ComponentProps, "className" | "style"> {
  readonly children: JSX.Element;
  readonly label?: string;
  readonly condition?: FieldCondition;
  readonly description?: string;
  readonly name: F;
  readonly form: FormInstance<V, TV>;
}

export const Field = <
  F extends LooseKeys<V>,
  V = DefaultFormValues,
  TV extends BaseTransformer<V> = DefaultTransformer<V>,
>({
  children,
  label,
  condition,
  form,
  name,
  description,
  ...props
}: FieldProps<F, V, TV>): JSX.Element => {
  const errors = form.getFieldError(name);
  return (
    <div {...props} className={classNames("form-field", props.className)}>
      {(condition !== undefined || label !== undefined) && (
        <div className="form-field__header">
          {label && <Label className="form-field__label">{label}</Label>}
          {condition && <FieldConditionText condition={condition} />}
        </div>
      )}
      {description !== undefined && <Text className="form-field__description">{description}</Text>}
      {children}
      {errors && <FormFieldErrors errors={errors} />}
    </div>
  );
};
