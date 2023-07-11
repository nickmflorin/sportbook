"use client";
import classNames from "classnames";
import { type Required } from "utility-types";

import { Form, type NativeFormProps } from "~/components/forms/Form";
import { ButtonFooter, type ButtonFooterProps } from "~/components/structural/ButtonFooter";
import { PartitionedContent, type PartitionedContentProps } from "~/components/structural/PartitionedContent";
import { Portal } from "~/components/structural/Portal";

export type DrawerFormProps<T extends Record<string, unknown>> = Required<
  Omit<PartitionedContentProps, "container">,
  "onClose"
> &
  Omit<ButtonFooterProps, "onSubmit" | "submitButtonType"> &
  NativeFormProps<T> & {
    readonly open: boolean;
  };

export const DrawerForm = <T extends Record<string, unknown>>({
  action,
  form,
  open,
  children,
  style,
  className,
  ...props
}: DrawerFormProps<T>): JSX.Element =>
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
            {params.children}
          </Form.Native>
        )}
      >
        {children}
      </PartitionedContent>
    </Portal>
  ) : (
    <></>
  );
