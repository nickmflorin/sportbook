import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { CloseButton } from "~/components/buttons/CloseButton";
import { Loading } from "~/components/loading";
import { ButtonFooter, type ButtonFooterProps } from "~/components/structural/ButtonFooter";
import { Header, type HeaderProps } from "~/components/views/Header";

import { Field, FieldConditions, FieldGroup } from "./fields/Field";
import { NativeForm, type NativeFormProps } from "./NativeForm";
import { type FormInstance, type BaseFormValues } from "./types";
import { useForm } from "./useForm";

export { type NativeFormProps } from "./NativeForm";
export * from "./types";

export type FormProps<I extends BaseFormValues, O extends BaseFormValues = I> = ComponentProps &
  Pick<HeaderProps, "title" | "description" | "actions" | "titleProps" | "descriptionProps"> &
  Omit<NativeFormProps, keyof ComponentProps | "action" | "onSubmit" | "submitButtonType"> &
  Omit<ButtonFooterProps, "onSubmit" | keyof ComponentProps> & {
    readonly form: FormInstance<I, O>;
    readonly loading?: boolean;
    readonly onSubmit?: (data: O) => void;
    readonly action?: (data: O) => void;
    readonly onClose?: () => void;
  };

export const Form = <I extends BaseFormValues, O extends BaseFormValues = I>({
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
  action,
  onClose,
  onSubmit,
  ...props
}: FormProps<I, O>): JSX.Element => {
  /* Normally, we would want to use the FormData from the action to reconstruct the values that are then provided to the
     API request.  However, because we are using Mantine's input components with Mantine's useForm hook (right now at
     least), the FormData will not have the corresponding values in the underlying <form /> because Mantine uses
     controlled inputs.

     Eventually we will want to improve this, and likely ditch Mantine's 'useForm' hook - while making the inputs it
     offers controlled such that they work with the action of the underlying <form />. */
  const handler = (cb: (data: O) => void) => {
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
      cb(form.getTransformedValues());
    }
  };

  const _action = action !== undefined ? () => handler(data => action?.(data)) : undefined;
  const _onSubmit = onSubmit !== undefined ? () => handler(data => onSubmit(data)) : undefined;

  if (_onSubmit && _action) {
    throw new Error("Both the action and submit handler cannot be simultaneously provided.");
  }

  return (
    <NativeForm style={style} className={classNames("form", className)} action={_action} onSubmit={_onSubmit}>
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
      <ButtonFooter {...props} submitDisabled={props.submitDisabled || loading} />
    </NativeForm>
  );
};

Form.Native = NativeForm;
Form.Field = Field;
Form.FieldGroup = FieldGroup;
Form.FieldCondition = FieldConditions;
Form.useForm = useForm;
