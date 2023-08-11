"use client";
import { useRef } from "react";

import classNames from "classnames";
import { type SubmitErrorHandler } from "react-hook-form";

import { type ComponentProps } from "~/lib/ui";
import { CloseButton } from "~/components/buttons/CloseButton";
import { FieldConditions } from "~/components/fields";
import { Field, FieldGroup, ControlledField } from "~/components/fields/Field";
import { Loading } from "~/components/loading";
import { ButtonFooter, type ButtonFooterProps } from "~/components/structural/ButtonFooter";
import { Header, type HeaderProps } from "~/components/views/Header";

import { NativeForm, type NativeFormProps } from "../NativeForm";
import { type FormInstance, type BaseFormValues } from "../types";
import { useForm } from "../useForm";

import { FormErrors, type IFormErrors } from "./FormErrors";

export { type NativeFormProps } from "../NativeForm";
export * from "../types";

type SubmitAction<I extends BaseFormValues> = (data: I, errorHandler: IFormErrors) => void;

export type FormProps<I extends BaseFormValues> = ComponentProps &
  Pick<HeaderProps, "title" | "description" | "actions" | "titleProps" | "descriptionProps"> &
  Omit<NativeFormProps, keyof ComponentProps | "action" | "onSubmit" | "submitButtonType"> &
  Omit<ButtonFooterProps, "onSubmit" | keyof ComponentProps> & {
    readonly form: FormInstance<I>;
    readonly loading?: boolean;
    readonly onSubmit?: SubmitAction<I>;
    readonly action?: SubmitAction<I>;
    readonly onClose?: () => void;
    readonly onError?: SubmitErrorHandler<I>;
  };

export const Form = <I extends BaseFormValues>({
  form: { handleSubmit },
  children,
  className,
  style,
  loading,
  actions,
  title,
  titleProps,
  description,
  descriptionProps,
  action,
  onClose,
  onSubmit,
  onError,
  ...props
}: FormProps<I>): JSX.Element => {
  const errorHandler = useRef<IFormErrors>(null);

  if (onSubmit && action) {
    throw new Error("Both the action and submit handler cannot be simultaneously provided.");
  }
  return (
    <NativeForm
      style={style}
      className={classNames("form", className)}
      action={
        action !== undefined
          ? () => {
              handleSubmit((data: I) => {
                if (errorHandler.current) {
                  errorHandler.current.clearErrors();
                  action(data, errorHandler.current);
                }
              }, onError)();
            }
          : undefined
      }
      onSubmit={
        onSubmit !== undefined
          ? handleSubmit(data => {
              if (errorHandler.current) {
                errorHandler.current.clearErrors();
                onSubmit(data, errorHandler.current);
              }
            }, onError)
          : undefined
      }
    >
      {onClose && <CloseButton className="form__close-button" onClick={onClose} />}
      <Header
        className="form__header"
        title={title}
        description={description}
        actions={actions}
        titleProps={titleProps}
        descriptionProps={descriptionProps}
      />
      <div className="form__content">
        <Loading loading={loading === true}>{children}</Loading>
      </div>
      <FormErrors handler={errorHandler} />
      <ButtonFooter {...props} submitDisabled={props.submitDisabled || loading} />
    </NativeForm>
  );
};

Form.Native = NativeForm;
Form.Field = Field;
Form.ControlledField = ControlledField;
Form.FieldGroup = FieldGroup;
Form.FieldCondition = FieldConditions;
Form.useForm = useForm;

export default Form;
