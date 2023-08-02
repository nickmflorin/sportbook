import { type JSX } from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";
import { Actions, type Action } from "~/components/structural";
import { Label } from "~/components/typography/Label";
import { Text } from "~/components/typography/Text";

import { type FormInstance, type BaseFormValues, type FieldError, type FormKeys } from "../../types";

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

type _BaseFieldProps<T> = T &
  ComponentProps & {
    readonly children: JSX.Element | JSX.Element[];
    readonly actions?: Action[];
    readonly label?: string;
    readonly condition?: FieldCondition;
    readonly description?: string;
    readonly _className?: string;
  };

type _FormFieldProps<
  K extends FormKeys<I>,
  I extends BaseFormValues,
  O extends BaseFormValues,
  _N extends K | K[],
> = _BaseFieldProps<{
  readonly form: FormInstance<I, O>;
  readonly name: _N;
  readonly errors?: never;
}>;

export type FormFieldProps<K extends FormKeys<I>, I extends BaseFormValues, O extends BaseFormValues> = _FormFieldProps<
  K,
  I,
  O,
  K
>;

export type GenericFieldProps = _BaseFieldProps<{
  readonly errors?: FieldError[];
  readonly form?: never;
  readonly name?: never;
}>;

type _FieldProps<K extends FormKeys<I>, I extends BaseFormValues, O extends BaseFormValues, _N extends K | K[]> =
  | GenericFieldProps
  | _FormFieldProps<K, I, O, _N>;

const _isControlFieldProps = <
  K extends FormKeys<I>,
  I extends BaseFormValues,
  O extends BaseFormValues,
  _N extends K | K[],
>(
  props: _FieldProps<K, I, O, _N>,
): props is _FormFieldProps<K, I, O, _N> => (props as _FormFieldProps<K, I, O, _N>).name !== undefined;

const _Field = <K extends FormKeys<I>, I extends BaseFormValues, O extends BaseFormValues, _N extends K | K[]>(
  props: _FieldProps<K, I, O, _N>,
): JSX.Element => {
  const { children, name, errors: _errors, _className = "form-field" } = props;
  const errors = _isControlFieldProps(props)
    ? props.form.getFieldErrors<K>(...(Array.isArray(name) ? name : [name]))
    : _errors;

  if (_isControlFieldProps(props)) {
    props.form;
  }
  return (
    <div style={props.style} className={classNames(_className, props.className)}>
      {(props.condition !== undefined || props.label !== undefined) && (
        <div className="form-field__header">
          {props.label && <Label className="form-field__label">{props.label}</Label>}
          {props.condition && <FieldConditionText condition={props.condition} />}
        </div>
      )}
      {props.description !== undefined && <Text className="form-field__description">{props.description}</Text>}
      <div className="form-field-content">
        {children}
        <Actions className="form-field-actions" actions={props.actions} />
      </div>
      {errors && <FormFieldErrors errors={errors} />}
    </div>
  );
};

type _FieldGroupProps<K extends FormKeys<I>, I extends BaseFormValues, O extends BaseFormValues> = _FieldProps<
  K,
  I,
  O,
  K[]
>;

const _FieldGroup = <K extends FormKeys<I>, I extends BaseFormValues, O extends BaseFormValues>({
  children,
  ...props
}: _FieldGroupProps<K, I, O>): JSX.Element => (
  <_Field<K, I, O, K[]> {...props} _className="form-field-group">
    {children}
  </_Field>
);

export const FieldGroup = _FieldGroup as {
  (props: GenericFieldProps): JSX.Element;
  <K extends FormKeys<I>, I extends BaseFormValues, O extends BaseFormValues>(
    props: _FormFieldProps<K, I, O, K[]>,
  ): JSX.Element;
};

export const Field = _Field as {
  (props: GenericFieldProps): JSX.Element;
  <K extends FormKeys<I>, I extends BaseFormValues, O extends BaseFormValues>(
    props: _FormFieldProps<K, I, O, K>,
  ): JSX.Element;
};
