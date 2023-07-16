import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { CloseButton } from "~/components/buttons";
import { ButtonFooter, type ButtonFooterProps } from "~/components/structural/ButtonFooter";
import { PartitionedContent, type PartitionedContentProps } from "~/components/structural/PartitionedContent";

import { Field, FieldConditions, FieldGroup } from "./fields/Field";
import { NativeForm, type NativeFormProps } from "./NativeForm";
import { type FormInstance, type BaseFormValues, type DefaultFormValues } from "./types";
import { useForm } from "./useForm";

export { type NativeFormProps } from "./NativeForm";
export * from "./types";

type Native = Omit<NativeFormProps, keyof ComponentProps | "action">;
type ButtonFootProps = Omit<ButtonFooterProps, "onSubmit" | "submitButtonType">;

type FormNativeProps<O extends BaseFormValues> = Native & {
  readonly action?: (data: O) => void;
  readonly component: "form";
  readonly onSubmit?: never;
};

type FormDivProps<O extends BaseFormValues> = Record<keyof Native, never> & {
  readonly action?: never;
  readonly component: "div";
  readonly onSubmit: (data: O) => void;
};

type FormComponentProps<C extends "div" | "form", O extends BaseFormValues> = C extends "div"
  ? FormDivProps<O>
  : FormNativeProps<O>;

export type FormProps<I extends BaseFormValues, O extends BaseFormValues, C extends "div" | "form"> = Omit<
  PartitionedContentProps,
  "container" | "footer"
> &
  ButtonFootProps &
  FormComponentProps<C, O> & {
    readonly form: FormInstance<I, O>;
    readonly onClose?: () => void;
  };

export const Form = <I extends BaseFormValues, O extends BaseFormValues, C extends "div" | "form">({
  form,
  children,
  className,
  style,
  loading,
  actions,
  title,
  titleProps,
  description,
  descriptionProps,
  component,
  action,
  onClose,
  onSubmit,
  ...props
}: FormProps<I, O, C>): JSX.Element => {
  /* Normally, we would want to use the FormData from the action to reconstruct the values that are then provided to the
     API request.  However, because we are using Mantine's input components with Mantine's useForm hook (right now at
     least), the FormData will not have the corresponding values in the underlying <form /> because Mantine uses
     controlled inputs.

     Eventually we will want to improve this, and likely ditch Mantine's 'useForm' hook - while making the inputs it
     offers controlled such that they work with the action of the underlying <form />. */
  const _action = () => {
    const result = form.validate();
    if (result.hasErrors) {
      form.setErrors(result.errors);
    } else {
      /* The way that the custom 'useForm' hook is typed is such that the two generic types, I and O, represent the type
         of the unvalidated form input and the type of the schema-validated form output, respectively.  Mantine's Form
         and associated 'useForm' hook do not respect these two separate typings, but instead expose a generic type for
         a transformation function (which we have typed such that it returns the type of the validated output). However,
         since we are using a schema to validate the form, we can assume that the current values in the form are the
         validated values of the form, since we have already performed the validation above.  Additionally, since we do
         not provide a transformation function, the return value of 'form.getTransformedValues()' is the same as the
         value of 'form.values' - but 'form.getTransformedValues()' is typed based on O, not I.

         This should be improved in the future as we will likely move away from Mantine's form hook. */
      action?.(form.getTransformedValues());
    }
  };

  return (
    <PartitionedContent
      style={style}
      loading={loading}
      actions={actions}
      title={title}
      titleProps={titleProps}
      description={description}
      descriptionProps={descriptionProps}
      className={classNames("form", className)}
      footer={
        <ButtonFooter
          {...props}
          submitButtonType={component === "form" ? "submit" : "button"}
          submitDisabled={props.submitDisabled || loading}
          onSubmit={
            component === "form"
              ? undefined
              : () => {
                  const result = form.validate();
                  if (result.hasErrors) {
                    form.setErrors(result.errors);
                  } else {
                    onSubmit?.(form.getTransformedValues());
                  }
                }
          }
        />
      }
      container={params =>
        component === "form" ? (
          <NativeForm {...params} action={_action}>
            <>
              {onClose && <CloseButton className="form__close-button" onClick={onClose} />}
              {params.children}
            </>
          </NativeForm>
        ) : (
          <div {...params}>
            {onClose && <CloseButton className="form__close-button" onClick={onClose} />}
            {params.children}
          </div>
        )
      }
    >
      {children}
    </PartitionedContent>
  );
};

Form.Native = NativeForm;
Form.Field = Field;
Form.FieldGroup = FieldGroup;
Form.FieldCondition = FieldConditions;
Form.useForm = useForm;
