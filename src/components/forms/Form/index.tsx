import classNames from "classnames";

import { ButtonFooter, type ButtonFooterProps } from "~/components/structural/ButtonFooter";
import { PartitionedContent, type PartitionedContentProps } from "~/components/structural/PartitionedContent";
import { type ComponentProps } from "~/lib/ui";

import { Field, FieldConditions } from "./Field";
import { NativeForm, type NativeFormProps } from "./NativeForm";
import { useForm } from "./useForm";

export { type NativeFormProps } from "./NativeForm";
export { type FormInstance, type FormInitialValues } from "./types";

export type FormProps<T extends Record<string, unknown>> = Omit<PartitionedContentProps, "container"> &
  Omit<ButtonFooterProps, "onSubmit" | "submitButtonType"> &
  Omit<NativeFormProps<T>, keyof ComponentProps>;

export const Form = <T extends Record<string, unknown>>({
  action,
  form,
  children,
  ...props
}: FormProps<T>): JSX.Element => (
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
