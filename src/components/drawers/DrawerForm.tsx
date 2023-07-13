"use client";
import classNames from "classnames";

import { CloseButton } from "~/components/buttons";
import { Form, type NativeFormProps, type BaseFormValues, type DefaultFormValues } from "~/components/forms";
import { ButtonFooter, type ButtonFooterProps } from "~/components/structural/ButtonFooter";
import { PartitionedContent, type PartitionedContentProps } from "~/components/structural/PartitionedContent";
import { Portal } from "~/components/structural/Portal";

export type DrawerFormProps<I extends BaseFormValues = DefaultFormValues, O extends BaseFormValues = I> = Omit<
  PartitionedContentProps,
  "container"
> &
  Omit<ButtonFooterProps, "onSubmit" | "submitButtonType"> &
  NativeFormProps<I, O> & {
    readonly open: boolean;
    readonly onClose?: () => void;
  };

export const DrawerForm = <I extends BaseFormValues = DefaultFormValues, O extends BaseFormValues = I>({
  action,
  onClose,
  form,
  open,
  children,
  style,
  className,
  ...props
}: DrawerFormProps<I, O>): JSX.Element =>
  open ? (
    <Portal id="drawer-target">
      <PartitionedContent
        {...props}
        style={style}
        className={classNames("form", "drawer-form", className)}
        footer={
          <ButtonFooter
            {...props}
            orientation="full-width"
            submitButtonType="submit"
            submitDisabled={props.submitDisabled || props.loading}
          />
        }
        container={params => (
          <Form.Native {...params} action={action} form={form}>
            <>
              {onClose && <CloseButton className="drawer__close-button" onClick={onClose} />}
              {params.children}
            </>
          </Form.Native>
        )}
      >
        {children}
      </PartitionedContent>
    </Portal>
  ) : (
    <></>
  );
