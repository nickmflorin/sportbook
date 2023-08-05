import { type JSX, useMemo } from "react";

import classNames from "classnames";
import { Controller, type ControllerProps, type FieldErrors, type FieldPath } from "react-hook-form";

import { type ComponentProps } from "~/lib/ui";
import { ensuresDefinedValue } from "~/lib/util";
import { FieldConditions, type FieldCondition } from "~/components/fields";
import { type FormInstance, type BaseFormValues, type FieldError } from "~/components/forms";
import { Actions, type Action } from "~/components/structural";
import { Label } from "~/components/typography/Label";
import { Text } from "~/components/typography/Text";

import { FormFieldErrors } from "./FieldErrors";

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

type _FormFieldProps<K extends FieldPath<I>, I extends BaseFormValues, _N extends K | K[]> = _BaseFieldProps<{
  readonly form: FormInstance<I>;
  readonly name: _N;
  readonly errors?: never;
}>;

type _GenericFieldProps = _BaseFieldProps<{
  readonly errors?: FieldError[];
  readonly form?: never;
  readonly name?: never;
}>;

type _FieldProps<K extends FieldPath<I>, I extends BaseFormValues, _N extends K | K[]> =
  | _GenericFieldProps
  | _FormFieldProps<K, I, _N>;

const _isControlFieldProps = <K extends FieldPath<I>, I extends BaseFormValues, _N extends K | K[]>(
  props: _FieldProps<K, I, _N>,
): props is _FormFieldProps<K, I, _N> => (props as _FormFieldProps<K, I, _N>).name !== undefined;

const _Field = <K extends FieldPath<I>, I extends BaseFormValues, _N extends K | K[]>(
  props: _FieldProps<K, I, _N>,
): JSX.Element => {
  let formErrors: FieldErrors<I> | undefined = undefined;
  const { children, name, errors: _errors, _className = "form-field" } = props;
  if (_isControlFieldProps(props)) {
    ({
      form: {
        formState: { errors: formErrors },
      },
    } = props);
  }
  const errors = useMemo(() => {
    // TODO: Build better support for multiple field errors in a group.
    const _name = ensuresDefinedValue(Array.isArray(name) ? name[0] : name);
    if (formErrors) {
      const errs = formErrors[_name as keyof FieldErrors<I>];
      if (errs !== undefined && errs.message !== undefined) {
        return [errs.message.toString()];
      }
      return [];
    }
    return _errors;
  }, [_errors, formErrors, name]);

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

export type FormFieldProps<K extends FieldPath<I>, I extends BaseFormValues> = Omit<
  _FormFieldProps<K, I, K>,
  "_className"
>;

export type ControlledFieldProps<K extends FieldPath<I>, I extends BaseFormValues> = Omit<
  FormFieldProps<K, I>,
  "children"
> & {
  readonly children: ControllerProps<I, K>["render"];
};

const _ControlledField = <K extends FieldPath<I>, I extends BaseFormValues>({
  children,
  ...props
}: ControlledFieldProps<K, I>): JSX.Element => (
  <Field<K, I> {...props}>
    <Controller control={props.form.control} name={props.name} render={children} />
  </Field>
);

type _FieldGroupProps<K extends FieldPath<I>, I extends BaseFormValues> = _FieldProps<K, I, K[]>;

const _FieldGroup = <K extends FieldPath<I>, I extends BaseFormValues>({
  children,
  ...props
}: _FieldGroupProps<K, I>): JSX.Element => (
  <_Field<K, I, K[]> {...props} _className="form-field-group">
    {children}
  </_Field>
);

export const FieldGroup = _FieldGroup as {
  (props: _GenericFieldProps): JSX.Element;
  <K extends FieldPath<I>, I extends BaseFormValues>(props: _FieldGroupProps<K, I>): JSX.Element;
};

export const Field = _Field as {
  (props: _GenericFieldProps): JSX.Element;
  <K extends FieldPath<I>, I extends BaseFormValues>(props: FormFieldProps<K, I>): JSX.Element;
};

export const ControlledField = _ControlledField as {
  <K extends FieldPath<I>, I extends BaseFormValues>(props: ControlledFieldProps<K, I>): JSX.Element;
};
