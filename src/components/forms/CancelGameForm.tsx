import React from "react";

import { zodResolver } from "@mantine/form";
import { type z } from "zod";

import { CancelGameSchema } from "~/prisma/model";
import { TextArea } from "~/components/input/TextArea";

import { Form, type FormProps } from "./Form";

export type CancelGameFormInput = z.input<typeof CancelGameSchema>;
export type CancelGameFormOutput = z.output<typeof CancelGameSchema>;

export type CancelGameFormProps = Omit<FormProps<CancelGameFormInput, CancelGameFormOutput>, "children" | "form">;

export const getInitialValues = (): CancelGameFormInput => ({
  cancellationReason: "",
});

export const CancelGameForm = (props: CancelGameFormProps): JSX.Element => {
  const form = Form.useForm<CancelGameFormInput, CancelGameFormOutput>({
    validate: zodResolver(CancelGameSchema),
    initialValues: getInitialValues(),
  });

  return (
    <Form<CancelGameFormInput, CancelGameFormOutput> {...props} form={form} buttonSize="xs">
      <Form.Field form={form} name="cancellationReason" label="Reason" condition={Form.FieldCondition.OPTIONAL}>
        <TextArea {...form.getInputProps("cancellationReason")} size="xs" placeholder="Inclement weather" minRows={2} />
      </Form.Field>
    </Form>
  );
};
