import React from "react";

import { TextInput } from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { type z } from "zod";

import { LocationSchema } from "~/prisma";

import { Form, type FormProps } from "./Form";

export type LocationFormInput = z.input<typeof LocationSchema>;
export type LocationFormOutput = z.output<typeof LocationSchema>;

export type CreateLocationFormProps<C extends "div" | "form"> = Omit<
  FormProps<LocationFormInput, LocationFormOutput, C>,
  "children" | "form"
>;

export const getInitialValues = (): z.input<typeof LocationSchema> => ({
  name: "",
  description: "",
  primaryStreetAddress: "",
  secondaryStreetAddress: "",
  zipCode: "",
  city: "",
  state: "",
});

export const CreateLocationForm = <C extends "div" | "form">(props: CreateLocationFormProps<C>): JSX.Element => {
  const form = Form.useForm<LocationFormInput, LocationFormOutput>({
    validate: zodResolver(LocationSchema),
    initialValues: getInitialValues(),
  });

  return (
    <Form<LocationFormInput, LocationFormOutput, C> {...props} form={form}>
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
