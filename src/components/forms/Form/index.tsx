import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { ButtonFooter, type ButtonFooterProps } from "~/components/structural/ButtonFooter";
import { PartitionedContent, type PartitionedContentProps } from "~/components/structural/PartitionedContent";

import { Field, FieldConditions } from "./Field";
import { NativeForm, type NativeFormProps } from "./NativeForm";
import { type BaseFormValues, type DefaultFormValues } from "./types";
import { useForm } from "./useForm";

export { type NativeFormProps } from "./NativeForm";
export * from "./types";

export type FormProps<I extends BaseFormValues = DefaultFormValues, O extends BaseFormValues = I> = Omit<
  PartitionedContentProps,
  "container"
> &
  Omit<ButtonFooterProps, "onSubmit" | "submitButtonType"> &
  Omit<NativeFormProps<I, O>, keyof ComponentProps>;

export const Form = <I extends BaseFormValues = DefaultFormValues, O extends BaseFormValues = I>({
  action,
  form,
  children,
  ...props
}: FormProps<I, O>): JSX.Element => (
  <PartitionedContent
    {...props}
    className={classNames("form", props.className)}
    footer={
      <ButtonFooter {...props} submitButtonType="submit" submitDisabled={props.submitDisabled || props.loading} />
    }
    container={params => (
      <NativeForm {...params} action={action} form={form}>
        {params.children}
      </NativeForm>
    )}
  >
    {children}
  </PartitionedContent>
);

Form.Native = NativeForm;
Form.Field = Field;
Form.FieldCondition = FieldConditions;
Form.useForm = useForm;
