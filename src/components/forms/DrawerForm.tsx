"use client";
import classNames from "classnames";

import { Portal } from "~/components/structural/Portal";

import { Form, type FormProps, type BaseFormValues, type DefaultFormValues } from "./Form";

export type DrawerFormProps<I extends BaseFormValues = DefaultFormValues, O extends BaseFormValues = I> = FormProps<
  I,
  O
> & {
  readonly open: boolean;
  readonly extra?: JSX.Element;
};

export const DrawerForm = <I extends BaseFormValues = DefaultFormValues, O extends BaseFormValues = I>({
  children,
  open,
  extra,
  ...props
}: DrawerFormProps<I, O>): JSX.Element => {
  if (!open) {
    return <></>;
  }
  return (
    <Portal id="drawer-target">
      <div className="drawer-form-wrapper">
        <Form {...props} className={classNames("drawer-form", props.className)}>
          {children}
        </Form>
        {extra}
      </div>
    </Portal>
  );
};
