import React from "react";

import { type z } from "zod";

import { TextAreaField } from "~/components/fields/TextAreaField";
import { CancelGameSchema } from "~/prisma/model";

import { Form, type FormProps } from "./Form";

export type CancelGameFormValues = z.infer<typeof CancelGameSchema>;

export type CancelGameFormProps = Omit<FormProps<CancelGameFormValues>, "children" | "form">;

export const getInitialValues = (): CancelGameFormValues => ({
  cancellationReason: "",
});

export const CancelGameForm = (props: CancelGameFormProps): JSX.Element => {
  const form = Form.useForm<CancelGameFormValues>({
    defaultValues: { cancellationReason: "" },
    schema: CancelGameSchema,
  });

  return (
    <Form<CancelGameFormValues> {...props} form={form} buttonSize="xs">
      <TextAreaField
        form={form}
        name="cancellationReason"
        label="Reason"
        condition={Form.FieldCondition.OPTIONAL}
        size="xs"
        placeholder="Inclement weather"
        minRows={2}
      />
    </Form>
  );
};
