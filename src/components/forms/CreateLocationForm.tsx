import React from "react";

import { type z } from "zod";

import { LocationSchema } from "~/prisma/model";
import { TextInput } from "~/components/input/TextInput";

import { Form, type FormProps } from "./Form";

export type LocationFormValues = z.infer<typeof LocationSchema>;

export type CreateLocationFormProps = Omit<FormProps<LocationFormValues>, "children" | "form">;

export const defaultValues = (): LocationFormValues => ({
  name: "",
  description: "",
  primaryStreetAddress: "",
  secondaryStreetAddress: "",
  zipCode: "",
  city: "",
  state: "",
});

export const CreateLocationForm = (props: CreateLocationFormProps): JSX.Element => {
  const form = Form.useForm<LocationFormValues>({
    schema: LocationSchema,
    defaultValues: {
      name: "",
      description: "",
      primaryStreetAddress: "",
      secondaryStreetAddress: "",
      zipCode: "",
      city: "",
      state: "",
    },
  });

  return (
    <Form<LocationFormValues> {...props} form={form}>
      <Form.ControlledField form={form} name="name" label="Name" condition={Form.FieldCondition.REQUIRED}>
        {({ field: { onChange, value } }) => <TextInput value={value} onChange={onChange} placeholder="Watkins Rink" />}
      </Form.ControlledField>
      <Form.ControlledField form={form} name="description" label="Description" condition={Form.FieldCondition.OPTIONAL}>
        {({ field: { onChange, value } }) => (
          <TextInput value={value} onChange={onChange} placeholder="Outdoor ball hockey court." />
        )}
      </Form.ControlledField>
      <Form.ControlledField
        form={form}
        name="primaryStreetAddress"
        label="Primary Address"
        condition={Form.FieldCondition.REQUIRED}
      >
        {({ field: { onChange, value } }) => <TextInput value={value} onChange={onChange} placeholder="123 Main St" />}
      </Form.ControlledField>
      <Form.ControlledField
        form={form}
        name="secondaryStreetAddress"
        label="Secondary Address"
        condition={Form.FieldCondition.OPTIONAL}
      >
        {({ field: { onChange, value } }) => <TextInput value={value} onChange={onChange} placeholder="Apt 208" />}
      </Form.ControlledField>
      <Form.ControlledField form={form} name="city" label="City" condition={Form.FieldCondition.REQUIRED}>
        {({ field: { onChange, value } }) => <TextInput value={value} onChange={onChange} placeholder="Phoenix" />}
      </Form.ControlledField>
      <Form.ControlledField form={form} name="state" label="State" condition={Form.FieldCondition.REQUIRED}>
        {({ field: { onChange, value } }) => <TextInput value={value} onChange={onChange} placeholder="AZ" />}
      </Form.ControlledField>
      <Form.ControlledField form={form} name="zipCode" label="Zip" condition={Form.FieldCondition.REQUIRED}>
        {({ field: { onChange, value } }) => <TextInput value={value} onChange={onChange} placeholder="12345" />}
      </Form.ControlledField>
    </Form>
  );
};
