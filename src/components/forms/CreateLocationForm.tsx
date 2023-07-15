import React from "react";

import { TextInput } from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { type z } from "zod";

import { LocationSchema } from "~/prisma";

import { Form, type FormProps } from "./Form";

export type LocationFormInput = z.input<typeof LocationSchema>;
export type LocationFormOutput = z.output<typeof LocationSchema>;

export type CreateLocationFormProps = Omit<FormProps<LocationFormInput, LocationFormOutput>, "children" | "form">;

export const getInitialValues = (): z.input<typeof LocationSchema> => ({
  name: "",
  primaryStreetAddress: "",
  secondaryStreetAddress: "",
  zipCode: "",
  city: "",
  state: "",
});

export const CreateLocationForm = (props: CreateLocationFormProps): JSX.Element => {
  const form = Form.useForm<LocationFormInput, LocationFormOutput>({
    validate: zodResolver(LocationSchema),
    initialValues: getInitialValues(),
  });

  return (
    <Form<LocationFormInput, LocationFormOutput> {...props} form={form}>
      <Form.Field form={form} name="name" label="Name" condition={Form.FieldCondition.REQUIRED}>
        <TextInput {...form.getInputProps("name")} placeholder="John Doe" />
      </Form.Field>
      <Form.Field
        form={form}
        name="primaryStreetAddress"
        label="Primary Address"
        condition={Form.FieldCondition.REQUIRED}
      >
        <TextInput {...form.getInputProps("primaryStreetAddress")} placeholder="123 Main St" />
      </Form.Field>
    </Form>
  );
};
