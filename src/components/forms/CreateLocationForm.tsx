import React from "react";

import { zodResolver } from "@mantine/form";
import { type z } from "zod";

import { LocationSchema } from "~/prisma/model";
import { TextInput } from "~/components/input/TextInput";

import { Form, type FormProps } from "./Form";

export type LocationFormInput = z.input<typeof LocationSchema>;
export type LocationFormOutput = z.output<typeof LocationSchema>;

export type CreateLocationFormProps = Omit<FormProps<LocationFormInput, LocationFormOutput>, "children" | "form">;

export const getInitialValues = (): LocationFormInput => ({
  name: "",
  description: "",
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
        <TextInput {...form.getInputProps("name")} placeholder="Watkins Rink" />
      </Form.Field>
      <Form.Field form={form} name="description" label="Description" condition={Form.FieldCondition.OPTIONAL}>
        <TextInput {...form.getInputProps("description")} placeholder="Outdoor ball hockey court." />
      </Form.Field>
      <Form.Field
        form={form}
        name="primaryStreetAddress"
        label="Primary Address"
        condition={Form.FieldCondition.REQUIRED}
      >
        <TextInput {...form.getInputProps("primaryStreetAddress")} placeholder="123 Main St" />
      </Form.Field>
      <Form.Field
        form={form}
        name="secondaryStreetAddress"
        label="Secondary Address"
        condition={Form.FieldCondition.OPTIONAL}
      >
        <TextInput {...form.getInputProps("secondaryStreetAddress")} placeholder="Apt 208" />
      </Form.Field>
      <Form.Field form={form} name="city" label="City" condition={Form.FieldCondition.REQUIRED}>
        <TextInput {...form.getInputProps("city")} placeholder="Phoenix" />
      </Form.Field>
      <Form.Field form={form} name="state" label="State" condition={Form.FieldCondition.REQUIRED}>
        <TextInput {...form.getInputProps("state")} placeholder="AZ" />
      </Form.Field>
      <Form.Field form={form} name="zipCode" label="Zip" condition={Form.FieldCondition.REQUIRED}>
        <TextInput {...form.getInputProps("zipCode")} placeholder="12345" />
      </Form.Field>
    </Form>
  );
};
