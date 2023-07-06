import { Button, Flex, LoadingOverlay } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";

import { LocalFeedback, type Feedback } from "~/components/feedback";

export type FormFooterProps = {
  readonly submitText?: string;
  readonly cancelText?: string;
  readonly submitting?: boolean;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly onCancel?: () => void;
};

export const FormFooter = ({ submitText = "Save", ...props }: FormFooterProps) => (
  <Flex direction="row" align="center" w="100%" justify="right" mt="md" gap="md">
    {(props.onCancel || props.cancelText) && (
      <Button variant="default" onClick={props.onCancel}>
        {props.cancelText || "Cancel"}
      </Button>
    )}
    <Button loading={props.submitting} type="submit" disabled={props.loading || props.submitting || props.disabled}>
      {submitText}
    </Button>
  </Flex>
);

export type FormProps<T extends Record<string, unknown>> = FormFooterProps & {
  readonly form: UseFormReturnType<T>;
  readonly children: JSX.Element | JSX.Element[];
  readonly feedback?: Feedback;
  readonly fieldGap?: string | number;
  readonly onSubmit: (data: T) => void;
};

export const Form = <T extends Record<string, unknown>>({
  feedback,
  fieldGap,
  ...props
}: FormProps<T>): JSX.Element => (
  <form onSubmit={props.form.onSubmit(data => props.onSubmit(data))} onReset={e => props.form.onReset(e)}>
    <LoadingOverlay visible={props.loading === true} />
    <Flex direction="column" gap={fieldGap}>
      {props.children}
    </Flex>
    <LocalFeedback feedback={feedback} />
    <FormFooter {...props} />
  </form>
);
